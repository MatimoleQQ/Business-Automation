from fastapi import APIRouter, Depends
from auth.deps import get_current_user

router = APIRouter()


@router.get("/dashboard")
def dashboard(user = Depends(get_current_user)):
    data = []

    return {
        "total_reports": len(data),
        "reports": data
    }