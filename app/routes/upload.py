from fastapi import APIRouter, UploadFile, File
import os

from app.services.processor import process_file

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # 🔥 ANALIZA PLIKU
    result = process_file(file_path)

    return {
        "message": "File uploaded and processed",
        "filename": file.filename,
        "analysis": result
    }