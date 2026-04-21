from fastapi import APIRouter

router = APIRouter()

@router.post("/test")
def test_upload():
    return {"message": "Upload route works"}