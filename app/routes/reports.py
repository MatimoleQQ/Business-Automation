from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.database.db import get_reports
import os

router = APIRouter()
print("🔥 REPORTS ROUTER LOADED")

@router.get("/")
def list_reports():
    reports = get_reports()

    return [
        {
            "id": r[0],
            "file_name": r[1],
            "rows": r[2],
            "columns": r[3],
            "report_path": r[6],
            "created_at": r[7],
        }
        for r in reports
    ]
@router.get("/download/{report_id}")
def download_report(report_id: int):
    reports = get_reports()

    for report in reports:
        if report[0] == report_id:
            file_path = report[2]

            if os.path.exists(file_path):
                return FileResponse(
                    path=file_path,
                    filename=os.path.basename(file_path),
                    media_type="application/pdf"
                )

            raise HTTPException(status_code=404, detail="PDF file not found")

    raise HTTPException(status_code=404, detail="Report not found")

@router.delete("/{report_id}")
def delete_report(report_id: int):
    reports = get_reports()

    for report in reports:
        if report[0] == report_id:
            file_path = report[6]

            # usuń PDF
            if os.path.exists(file_path):
                os.remove(file_path)

            # usuń z DB
            from app.database.db import delete_report_by_id
            delete_report_by_id(report_id)

            return {"message": "Deleted"}

    raise HTTPException(status_code=404, detail="Report not found")