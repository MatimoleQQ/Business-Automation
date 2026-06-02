from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.report import Report
from app.auth.deps import get_current_user
from fastapi.responses import FileResponse

import os

router = APIRouter()


# =====================
# GET ALL REPORTS
# =====================
@router.get("/")
def get_reports(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    reports = db.query(Report).filter(
        Report.user_id == current_user["id"]
    ).all()

    return [
        {
            "id": r.id,
            "file_name": r.file_name,
            "csv_url": f"/files/{os.path.basename(r.csv_path)}" if r.csv_path else None,
            "pdf_url": f"/files/{os.path.basename(r.pdf_path)}" if r.pdf_path else None,
            "created_at": getattr(r, "created_at", None),
            "status": r.status,
            "analysis": r.analysis
        }
        for r in reports
    ]


# =====================
# DOWNLOAD PDF
# =====================
@router.get("/{report_id}/download")
def download_report(
        report_id: int,
        db: Session = Depends(get_db),
        user=Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if not report.pdf_path:
        raise HTTPException(status_code=404, detail="No PDF")

    if not os.path.exists(report.pdf_path):
        raise HTTPException(status_code=404, detail="File not found on disk")

    return FileResponse(
        report.pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(report.pdf_path)
    )

# =====================
# DOWNLOAD CSV
# =====================
@router.get("/{report_id}/download-csv")
def download_csv(
        report_id: int,
        db: Session = Depends(get_db),
        user=Depends(get_current_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if not report.csv_path:
        raise HTTPException(status_code=404, detail="No CSV")

    if not os.path.exists(report.csv_path):
        raise HTTPException(
            status_code=404,
            detail="CSV file not found on disk"
        )

    return FileResponse(
        path=report.csv_path,
        media_type="text/csv",
        filename=os.path.basename(report.csv_path)
    )


# =====================
# DELETE REPORT
# =====================
@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()

    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    # 🔥 DELETE CSV
    if report.csv_path and os.path.exists(report.csv_path):
        os.remove(report.csv_path)

    # 🔥 DELETE PDF
    if report.pdf_path and os.path.exists(report.pdf_path):
        os.remove(report.pdf_path)

    db.delete(report)
    db.commit()

    return {"message": "deleted"}

# ======================
# DETAILS
# ======================
@router.get("/{report_id}")
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == current_user["id"]
    ).first()
    print("REPORT RAW:", report.__dict__)
    if not report:
        raise HTTPException(status_code=404, detail="Not found")

    return {
        "id": report.id,
        "file_name": report.file_name,
        "status": report.status,
        "rows": report.rows,
        "columns": report.columns,
        "analysis": report.analysis,
        "created_at": report.created_at,

        "csv_url": f"/files/{os.path.basename(report.csv_path)}" if report.csv_path else None,
        "pdf_url": f"/files/{os.path.basename(report.pdf_path)}" if report.pdf_path else None,
    }