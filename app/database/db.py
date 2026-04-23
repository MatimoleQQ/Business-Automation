import sqlite3

DB_PATH = "app/database/reports.db"

REPORTS_DB = []

def save_report(report):
    REPORTS_DB.append(report)

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_name TEXT,
        report_path TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


def save_report(file_name, report_path):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO reports (file_name, report_path)
    VALUES (?, ?)
    """, (file_name, report_path))

    conn.commit()
    conn.close()


def get_reports():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM reports ORDER BY created_at DESC")
    rows = cursor.fetchall()

    conn.close()
    return rows