from sqlalchemy import Column, Integer, String, JSON
from app.database.db import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String)
    rows = Column(Integer)
    columns = Column(Integer)
    column_names = Column(JSON)
    missing_values = Column(JSON)
    pdf_path = Column(String)