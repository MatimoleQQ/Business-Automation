from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.auth.utils import create_token

router = APIRouter()


class LoginData(BaseModel):
    email: str
    password: str


class RegisterData(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(data: LoginData):
    print("DATA:", data)
    print("PASSWORD LEN:", len(data.password))
    if data.email == "test@test.com" and data.password == "123":
        token = create_token(user_id=1)
        return {"access_token": token}


    raise HTTPException(401, "Invalid credentials")


@router.post("/register")
def register(data: RegisterData):
    print("DATA:", data)
    print("PASSWORD LEN:", len(data.password))
    return {

        "message": "User registered (DEV MODE)",
        "email": data.email
    }