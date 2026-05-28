from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime
import shutil
import asyncio
from app.ws.ws_service import broadcast_reports
from app.services.worker import process_report
from app.services.processor import get_base_name, generate_pdf_name
from app.models.report import Report
from app.database.db import get_db
from app.services.processor import process_file
from app.services.report_generator import generate_pdf_report
from app.services.report_service import get_reports_list
from app.ws.ws_manager import manager
from app.auth.deps import get_current_user
import os

router = APIRouter()

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user = Depends(get_current_user)
):

    os.makedirs("reports", exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")


    pdf_name = generate_pdf_name(file.filename)
    csv_path = f"reports/{file.filename}"
    pdf_path = f"reports/{pdf_name}"

    with open(csv_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    analysis = process_file(csv_path)

    generate_pdf_report(csv_path, analysis, pdf_path)
    report = Report(
        file_name=get_base_name(file.filename),
        csv_path=csv_path,
        pdf_path=pdf_path,
        rows=analysis["rows"],
        columns=analysis["columns"],
        analysis=analysis,
        status="processing",
        user_id= current_user["id"]
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    asyncio.create_task(process_report(report.id))
    print(analysis)
    await manager.broadcast(get_reports_list())


    return {
        "id": report.id,
        "status": "processing"
    }