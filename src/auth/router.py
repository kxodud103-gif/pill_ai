from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from src.auth.models import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from src.auth.database import get_user_by_email, get_user_by_username, create_user
from src.auth.hashing import hash_password, verify_password
from src.auth.jwt_handler import create_access_token, decode_access_token

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="토큰이 유효하지 않거나 만료되었습니다")
    user = get_user_by_email(payload.get("sub"))
    if not user:
        raise HTTPException(status_code=401, detail="유저를 찾을 수 없습니다")
    return user

@router.post("/register", response_model=UserResponse, status_code=201)
def register(body: RegisterRequest):
    if get_user_by_email(body.email):
        raise HTTPException(status_code=409, detail="이미 사용 중인 이메일입니다")
    if get_user_by_username(body.username):
        raise HTTPException(status_code=409, detail="이미 사용 중인 닉네임입니다")
    user = create_user(
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password)
    )
    return UserResponse(
        user_id=user["USER_ID"],
        username=user["USERNAME"],
        email=user["EMAIL"]
    )

@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    user = get_user_by_email(body.email)
    if not user or not verify_password(body.password, user["PASSWORD"]):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다")
    token = create_access_token({"sub": user["EMAIL"], "username": user["USERNAME"]})
    return TokenResponse(access_token=token)

@router.get("/me", response_model=UserResponse)
def me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        user_id=current_user["USER_ID"],
        username=current_user["USERNAME"],
        email=current_user["EMAIL"]
    )