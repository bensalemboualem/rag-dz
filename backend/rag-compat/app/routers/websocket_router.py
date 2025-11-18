"""
WebSocket router for real-time updates
"""
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from ..websocket import manager
from ..db import get_tenant_by_key

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    api_key: str = Query(..., description="API key for authentication")
):
    """
    WebSocket endpoint for real-time updates

    Query params:
        api_key: API key for authentication

    Messages format:
        {
            "operation_id": "unique-id",
            "status": "started|progress|completed|error",
            "progress": 0-100,
            "message": "Status message",
            "data": {...}
        }
    """
    # Authenticate
    tenant = get_tenant_by_key(api_key)
    if not tenant:
        await websocket.close(code=4001, reason="Invalid API key")
        return

    tenant_id = tenant["id"]

    # Accept connection
    await manager.connect(websocket, tenant_id)

    try:
        # Send welcome message
        await manager.send_personal_message(
            {
                "type": "connection",
                "status": "connected",
                "tenant_id": tenant_id,
                "message": "WebSocket connected successfully"
            },
            websocket
        )

        # Keep connection alive and handle incoming messages
        while True:
            data = await websocket.receive_text()

            # Echo back for ping/pong
            if data == "ping":
                await manager.send_personal_message(
                    {"type": "pong"},
                    websocket
                )
            else:
                # Handle other message types if needed
                logger.debug(f"Received WebSocket message: {data}")

    except WebSocketDisconnect:
        manager.disconnect(websocket, tenant_id)
        logger.info(f"Client disconnected: tenant {tenant_id}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, tenant_id)
