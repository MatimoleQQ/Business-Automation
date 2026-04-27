import sqlite3
import json
from app.models.report import Report

DB_NAME = "app.db"


def init_db():
    conn = sqlite3.connect(DB_NAME)
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


def save_report(report: Report):
    conn = sqlite3.connect(DB_NAME)
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
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM reports")
    rows = cursor.fetchall()

    conn.close()
    return rows