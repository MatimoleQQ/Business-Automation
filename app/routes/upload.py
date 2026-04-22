from fastapi import APIRouter, UploadFile, File
from app.services.email_sender import send_gmail
from app.database.db import save_report
from app.services.processor import process_file
from app.services.report_generator import generate_pdf_report
from datetime import datetime


import os


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
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    report_path = f"reports/{file.filename}_{timestamp}.pdf"
    generate_pdf_report(file.filename, analysis, report_path)

    # Save Report
    save_report(file.filename, report_path)

    # Send Mail
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