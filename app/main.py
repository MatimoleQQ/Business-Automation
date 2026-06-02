from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.ws.ws_manager import manager
from app.services.report_service import get_reports_list
from app.routes import auth, upload, reports, dashboard
from app.database.db import Base, engine
from app.models import report, user
import os
import asyncio

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
        "http://127.0.0.1:5173",
        "https://business-automation-mqf0x4i2q-themartino.vercel.app",
        "https://business-automation-git-main-themartino.vercel.app",
        "https://business-automation-pink-two.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REPORTS_DIR = os.path.abspath(os.path.join(BASE_DIR,"..", "reports"))

print("REPORTS_DIR:", REPORTS_DIR)

os.makedirs(REPORTS_DIR, exist_ok=True)

app.mount(
    "/files",
    StaticFiles(directory=REPORTS_DIR),
    name="files"
)

app.mount("/files", StaticFiles(directory="reports"), name="files")
app.mount("/reports", StaticFiles(directory="reports"), name="reports")

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])


Base.metadata.create_all(bind=engine)

async def broadcast_reports(data):
    for conn in active_connections:
        await conn.send_json(data)

active_connections = []

@app.get("/ping")
def ping():
    return {"ok": True}
@app.get("/")
def home():
    return {"message": "Business Automation System is running"}
@app.websocket("/ws/reports")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)
@app.websocket("/ws/test")
async def test_ws(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("OK WS")
    await websocket.close()