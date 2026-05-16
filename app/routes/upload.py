from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import shutil
import os

from app.models.report import Report
from app.database.db import get_db
from app.services.processor import process_file
from app.services.report_generator import generate_pdf_report

router = APIRouter()


@router.post("/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    import os
    import shutil
    from datetime import datetime

    os.makedirs("reports", exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    # --- CSV PATH ---
    csv_path = f"reports/{file.filename}"
    pdf_path = f"reports/{file.filename}_{timestamp}.pdf"

    # --- SAVE CSV ---
    with open(csv_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    analysis = process_file(csv_path)

    #=====================================
    #     Generate PDF
    #=====================================
    try:
        from app.services.report_generator import generate_pdf_report

        generate_pdf_report(csv_path, analysis, pdf_path)

        print("PDF CREATED:", pdf_path)

    except Exception as e:
        print("PDF ERROR:", e)

    # =====================================
    #     DB Save
    # =====================================
    report = Report(
        file_name=file.filename,
        csv_path=csv_path,
        pdf_path=pdf_path,
        rows=analysis["rows"],
        columns=analysis["columns"],
        analysis=analysis
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {"id": report.id}