from fastapi import APIRouter
from app.database.db import get_reports
import json

router = APIRouter()

@router.get("/dashboard")
def dashboard():
    data = get_reports()

    return {
        "total_reports": len(data),
        "reports": [
            {
                "id": r[0],
                "filename": r[1],
                "rows": r[2],
                "columns": r[3],
                "column_names": json.loads(r[4]),
                "missing_values": json.loads(r[5]),
                "pdf_path": r[6],
                "created_at": r[7],
            }
            for r in data
        ]
    }