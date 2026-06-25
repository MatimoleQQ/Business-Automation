from ws.ws_manager import manager
from services.report_service import get_reports_list

async def broadcast_reports():
    await manager.broadcast(get_reports_list())