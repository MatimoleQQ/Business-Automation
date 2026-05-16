import sqlite3

conn = sqlite3.connect("reports.db")
cursor = conn.cursor()

cursor.execute("ALTER TABLE reports ADD COLUMN user_id INTEGER")

conn.commit()
conn.close()

print("DONE")