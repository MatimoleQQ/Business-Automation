import sqlite3
import json
import os
from app.models.report import Report


DB_NAME = "reports.db"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "reports.db")

def get_connection():
    return sqlite3.connect(DB_PATH)
def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        rows INTEGER,
        columns INTEGER,
        column_names TEXT,
        missing_values TEXT,
        pdf_path TEXT,
        created_at TEXT
    )
    """)

    conn.commit()
    conn.close()
    print("🔥 DB READY")


def save_report(report: Report):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO reports (
        filename, rows, columns, column_names,
        missing_values, pdf_path, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        report.filename,
        report.rows,
        report.columns,
        json.dumps(report.column_names),
        json.dumps(report.missing_values),
        report.pdf_path,
        report.created_at
    ))

    conn.commit()
    conn.close()


def get_reports():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM reports")
    rows = cursor.fetchall()

    conn.close()
    return rows

def delete_report_by_id(report_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM reports WHERE id = ?", (report_id,))
    conn.commit()
    conn.close()