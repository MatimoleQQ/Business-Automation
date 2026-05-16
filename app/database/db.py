import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

DB_DIR = os.path.join(BASE_DIR, "app", "database")
os.makedirs(DB_DIR, exist_ok=True)

db_path = os.path.join(DB_DIR, "app.db")

SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"


print("📦 DB PATH:", db_path)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()

print("DB URL:", SQLALCHEMY_DATABASE_URL)
print("DB FILE:", db_path)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()