const BASE_URL = "https://pillai-production.up.railway.app";

// ── 회원가입
export async function signup(email, password, username) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = typeof data.detail === "string"
      ? data.detail
      : JSON.stringify(data.detail);
    throw new Error(msg || "회원가입 실패");
  }
  return data;
}

// ── 로그인
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = typeof data.detail === "string"
      ? data.detail
      : JSON.stringify(data.detail);
    throw new Error(msg || "로그인 실패");
  }
  return data;
}

// ── 토큰 저장/불러오기/삭제
export const saveToken   = (token) => localStorage.setItem("token", token);
export const getToken    = ()      => localStorage.getItem("token");
export const removeToken = ()      => localStorage.removeItem("token");