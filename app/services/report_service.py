from app.models.report import Report
from app.database.db import SessionLocal
from app.ws.ws_manager import manager
from datetime import datetime
import os


def get_reports_list():
    db = SessionLocal()
    try:
        reports = db.query(Report).all()

        return [
            {
                "id": r.id,
                "file_name": r.file_name,
                "status": r.status,
                "pdf_url": r.pdf_path,
                "csv_url": r.csv_path,
                "created_at": str(r.created_at),
                "analysis": r.analysis,
            }
            for r in reports
        ]
    finally:
        db.close()
def update_status(db, report, status):
    report.status = status
    db.commit()
    db.refresh(report)