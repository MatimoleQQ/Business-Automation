from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse


from app.routes import auth, upload, reports, dashboard
from app.database.db import Base, engine
from app.models import report, user
import os

print("MAIN STARTED")

app = FastAPI(
    title="Business Automation System",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REPORTS_DIR = os.path.abspath(os.path.join(BASE_DIR, "reports"))

print("REPORTS_DIR:", REPORTS_DIR)

app.mount(
    "/files",
    StaticFiles(directory=REPORTS_DIR),
    name="files"
)

app.mount("/reports", StaticFiles(directory="reports"), name="reports")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])

Base.metadata.create_all(bind=engine)

@app.get("/ping")
def ping():
    return {"ok": True}

@app.get("/")
def home():
    return {"message": "Business Automation System is running"}