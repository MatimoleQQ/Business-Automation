import asyncio

from database.db import SessionLocal
from models.report import Report
from services.report_service import update_status
from ws.ws_service import broadcast_reports


async def process_report(report_id: int):
    db = SessionLocal()

    report = db.query(Report).filter(Report.id == report_id).first()

    try:
        await update_report_status(db, report, "queued")
        await asyncio.sleep(1)

        await update_report_status(db, report, "processing")
        await asyncio.sleep(2)

        await update_report_status(db, report, "analyzing")
        await asyncio.sleep(2)

        # ANALYZE CSV HERE

        await update_report_status(db, report, "generating_pdf")
        await asyncio.sleep(2)

        # GENERATE PDF HERE

        await update_report_status(db, report, "done")

    except Exception as e:
        print(e)

        await update_report_status(db, report, "failed")

    finally:
        db.close()
async def update_report_status(db, report, status):
    update_status(db, report, status)
    await broadcast_reports()