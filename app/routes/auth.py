from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db, engine, Base
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest
from app.auth.utils import hash_password, verify_password, create_token

router = APIRouter()

# ================= REGISTER =================
@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == data.email).first()

    if existing:
        raise HTTPException(400, "User already exists")

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created"}


# ================= LOGIN =================
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    token = create_token(user.id, user.email)

    return {"access_token": token}