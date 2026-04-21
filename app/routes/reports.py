from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def test_reports():
    return {"message": "Reports route works"}