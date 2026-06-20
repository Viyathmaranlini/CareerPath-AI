import os
import sqlite3
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt, JWTError

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "careerpath-ai-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

DB_PATH = "data/careerpath.db"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_auth_tables():
    """Users සහ saved_roadmaps tables හදනවා"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS saved_roadmaps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            target_role TEXT NOT NULL,
            roadmap_data TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Auth tables created!")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def create_user(name: str, email: str, password: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return None, "Email already registered"

    hashed_pw = hash_password(password)
    created_at = datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO users (name, email, hashed_password, created_at)
        VALUES (?, ?, ?, ?)
    """, (name, email, hashed_pw, created_at))

    user_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return user_id, None


def get_user_by_email(email: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, hashed_password FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return {"id": row[0], "name": row[1], "email": row[2], "hashed_password": row[3]}
    return None


def get_user_by_id(user_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return {"id": row[0], "name": row[1], "email": row[2]}
    return None


def save_roadmap(user_id: int, target_role: str, roadmap_data: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()

    cursor.execute("""
        INSERT INTO saved_roadmaps (user_id, target_role, roadmap_data, created_at)
        VALUES (?, ?, ?, ?)
    """, (user_id, target_role, roadmap_data, created_at))

    roadmap_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return roadmap_id


def get_user_roadmaps(user_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, target_role, roadmap_data, created_at
        FROM saved_roadmaps WHERE user_id = ?
        ORDER BY created_at DESC
    """, (user_id,))
    rows = cursor.fetchall()
    conn.close()

    return [
        {"id": r[0], "target_role": r[1], "roadmap_data": r[2], "created_at": r[3]}
        for r in rows
    ]


def delete_roadmap(roadmap_id: int, user_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM saved_roadmaps WHERE id = ? AND user_id = ?", (roadmap_id, user_id))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted