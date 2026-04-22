import sqlite3

db_path = "reports.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT * FROM reports")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()