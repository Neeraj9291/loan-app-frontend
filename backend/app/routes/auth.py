from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from app.database import get_db
from app.controllers.auth_controller import register_user, login_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

class RegisterRequest(BaseModel):
    name:     str
    email:    str
    mobile:   str
    password: str

class LoginRequest(BaseModel):
    email:    str
    password: str

@router.post("/register")
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(db, body.name, body.email, body.mobile, body.password)

@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, body.email, body.password)
