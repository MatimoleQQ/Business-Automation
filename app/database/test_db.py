from sqlalchemy import create_engine

DATABASE_URL = "postgresql://admin:password@localhost:5432/business_automation"

engine = create_engine(DATABASE_URL)

try:
    conn = engine.connect()
    print("DB CONNECTION OK 🔥")
    conn.close()
except Exception as e:
    print("ERROR:", e)