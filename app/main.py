from fastapi import FastAPI
from app.routes import auth, upload, reports
from app.database.db import init_db
from app.routes import dashboard
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.db import init_db


print("🔥 MAIN STARTED")


init_db()

app = FastAPI(
    title="Business Automation System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/reports", StaticFiles(directory="reports"), name="reports")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/upload", tags=["Upload"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])

init_db()
@app.get("/ping")
def ping():
    return {"ok": True}


@app.get("/")
def home():
    return {"message": "Business Automation System is running"}