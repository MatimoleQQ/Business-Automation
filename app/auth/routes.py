from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth.utils import create_token

router = APIRouter()


class LoginData(BaseModel):
    email: str
    password: str


class RegisterData(BaseModel):
    email: str
    password: str



@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    access_token = create_access_token({
        "user_id": user.id,
        "email": user.email
    })

    refresh_token = create_refresh_token({
        "user_id": user.id
    })

    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email
        }
    }


@router.post("/register")
def register(data: RegisterData):
    print("DATA:", data)
    print("PASSWORD LEN:", len(data.password))
    return {

        "message": "User registered (DEV MODE)",
        "email": data.email
    }

@router.post("/refresh")
def refresh_token(data: dict):

    token = data.get("refresh_token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(401, "Invalid refresh token")

        new_access_token = create_access_token({
            "user_id": payload["user_id"]
        })

        return {
            "access_token": new_access_token
        }

    except:
        raise HTTPException(401, "Invalid refresh token")