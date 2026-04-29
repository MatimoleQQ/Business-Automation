from fastapi import APIRouter, UploadFile, File
from app.services.email_sender import send_gmail
from app.services.processor import process_file
from app.services.report_generator import generate_pdf_report
from datetime import datetime
from app.models.report import Report
from app.database.db import save_report
import os

print("1 start")
router = APIRouter()

UPLOAD_DIR = "uploads"
REPORT_DIR = "reports"


os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)

print("config done")
@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)


    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Analysis
    analysis = process_file(file_path)
    print("2 analysis ok")

    # Timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # PDF Path
    report_path = f"reports/{file.filename}_{timestamp}.pdf"
    report_path = str(report_path)


    # PDF Generate
    generate_pdf_report(file.filename, analysis, report_path)
    print("3 pdf ok")

    print("analysis:", analysis)
    print("report_path:", report_path)

    # Report Save
    report = Report(
        filename=file.filename,
        rows=analysis["rows"],
        columns=analysis["columns"],
        column_names=analysis["column_names"],
        missing_values=analysis["missing_values"],
        pdf_path=report_path
    )

    save_report(report)
    print("4 db ok")

    # Send Mail
    send_gmail(
        receiver="witmar6204@gmail.com",
        subject="Business Report Ready",
        body="Attached is your report.",
        attachment_path=report_path
    )

    return {
        "message": "File processed successfully",
        "report": {
            "filename": report.filename,
            "rows": report.rows,
            "columns": report.columns,
            "pdf": report.pdf_path
        }
    }