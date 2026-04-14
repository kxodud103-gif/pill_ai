import os
import psycopg2
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

def get_auth_connection():
    return psycopg2.connect(os.environ.get("AUTH_DB_URL"))

def get_user_by_email(email: str) -> Optional[dict]:
    conn = get_auth_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT user_id, username, email, password FROM users WHERE email = %s",
        (email,)
    )
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return None
    result = {
        "USER_ID": row[0],
        "USERNAME": row[1],
        "EMAIL": row[2],
        "PASSWORD": row[3]
    }
    cursor.close()
    conn.close()
    return result

def get_user_by_username(username: str) -> Optional[dict]:
    conn = get_auth_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT user_id, username, email, password FROM users WHERE username = %s",
        (username,)
    )
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return None
    result = {
        "USER_ID": row[0],
        "USERNAME": row[1],
        "EMAIL": row[2],
        "PASSWORD": row[3]
    }
    cursor.close()
    conn.close()
    return result

def create_user(username: str, email: str, hashed_password: str) -> Optional[dict]:
    conn = get_auth_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO users (username, email, password)
        VALUES (%s, %s, %s)
    """, (username, email, hashed_password))
    conn.commit()
    cursor.close()
    conn.close()
    return get_user_by_email(email)