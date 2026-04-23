from fastapi import APIRouter
from app.database.db import REPORTS_DB

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    return {
        "total_reports": len(REPORTS_DB),
        "reports": [
            {
                "filename": r.filename,
                "rows": r.rows,
                "columns": r.columns,
                "column_names": r.column_names,
                "missing_values": r.missing_values,
                "pdf_path": r.pdf_path,
                "created_at": r.created_at
            }
            for r in REPORTS_DB
        ]
    }