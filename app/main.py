from fastapi import FastAPI
from app.routes import auth, upload, reports
from app.database.db import init_db

app = FastAPI(
    title="Business Automation System",
    version="1.0.0"
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])


init_db()

@app.get("/")
def home():
    return {"message": "Business Automation System is running"}