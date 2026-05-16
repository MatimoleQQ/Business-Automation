from app.models.report import Report
from app.database.db import SessionLocal


def save_report(db, report):
    db.add(report)
    db.commit()
    db.refresh(report)

    return report