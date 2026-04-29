import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models.user import User

SECRET_KEY = "lendswift_secret_key_2024"
ALGORITHM  = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode({**data, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def register_user(db: Session, name: str, email: str, mobile: str, password: str) -> dict:
    if db.query(User).filter(User.email == email).first():
        return {"success": False, "message": "Email already registered"}

    user = User(
        name     = name,
        email    = email,
        mobile   = mobile,
        password = hash_password(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_token({"sub": str(user.id), "email": user.email})
    return {"success": True, "token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}

def login_user(db: Session, email: str, password: str) -> dict:
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        return {"success": False, "message": "Invalid email or password"}

    token = create_token({"sub": str(user.id), "email": user.email})
    return {"success": True, "token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}
