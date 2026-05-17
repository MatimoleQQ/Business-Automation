from app.database.db import SessionLocal
from app.models.report import Report
from app.services.processor import process_file
from app.services.report_generator import generate_pdf_report
import os

def process_report(report_id: int):
    db = SessionLocal()

    try:
        report = db.query(Report).filter(Report.id == report_id).first()

        if not report:
            return

        csv_path = report.csv_path

        # 1. analiza CSV
        analysis = process_file(csv_path)

        # 2. pdf path
        pdf_path = csv_path + "_report.pdf"

        # 3. generate pdf
        generate_pdf_report(csv_path, analysis, pdf_path)

        # 4. update DB
        report.analysis = analysis
        report.pdf_path = pdf_path
        report.status = "done"

        db.commit()

    except Exception as e:
        report.status = "failed"
        db.commit()
        print("Worker error:", e)

    finally:
        db.close()