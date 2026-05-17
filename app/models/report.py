from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.database.db import Base
from sqlalchemy.types import JSON
from datetime import datetime

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    file_name = Column(String)
    csv_path = Column(String)
    rows = Column(Integer)
    columns = Column(Integer)

    column_names = Column(JSON)
    missing_values = Column(JSON)


    pdf_path = Column(String)
    analysis = Column(JSON)

    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="processing")