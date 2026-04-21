from fastapi import APIRouter, UploadFile, File
from app.services.gmail_sender import send_gmail
import os

from app.services.processor import process_file
from app.services.report_generator import generate_pdf_report

router = APIRouter()

UPLOAD_DIR = "uploads"
REPORT_DIR = "reports"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)


@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Analysis
    analysis = process_file(file_path)


    # PDF Report
    report_path = os.path.join(REPORT_DIR, f"{file.filename}_report.pdf")
    generate_pdf_report(file.filename, analysis, report_path)

    # Sending Mail
    send_gmail(
        receiver="witmar6204@gmail.com",
        subject="Business Report Ready",
        body="Attached is your report.",
        attachment_path=report_path
    )

    return {
        "message": "File processed and report generated",
        "analysis": analysis,
        "report": report_path
    }