"""
WebSocket support for real-time updates
"""
import logging
import json
from typing import Dict, Set
from fastapi import WebSocket, WebSocketDisconnect
from dataclasses import dataclass, asdict
from datetime import datetime

logger = logging.getLogger(__name__)


@dataclass
class ProgressUpdate:
    """Progress update message"""
    operation_id: str
    status: str  # 'started', 'progress', 'completed', 'error'
    progress: int  # 0-100
    message: str
    data: Dict = None
    timestamp: str = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow().isoformat()

    def to_dict(self):
        result = asdict(self)
        if result['data'] is None:
            result['data'] = {}
        return result


class ConnectionManager:
    """Manage WebSocket connections"""

    def __init__(self):
        # tenant_id -> Set of WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, tenant_id: str):
        """Accept and store WebSocket connection"""
        await websocket.accept()
        if tenant_id not in self.active_connections:
            self.active_connections[tenant_id] = set()
        self.active_connections[tenant_id].add(websocket)
        logger.info(f"WebSocket connected for tenant {tenant_id}")

    def disconnect(self, websocket: WebSocket, tenant_id: str):
        """Remove WebSocket connection"""
        if tenant_id in self.active_connections:
            self.active_connections[tenant_id].discard(websocket)
            if not self.active_connections[tenant_id]:
                del self.active_connections[tenant_id]
        logger.info(f"WebSocket disconnected for tenant {tenant_id}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific connection"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending WebSocket message: {e}")

    async def broadcast_to_tenant(self, tenant_id: str, message: dict):
        """Broadcast message to all connections of a tenant"""
        if tenant_id not in self.active_connections:
            return

        disconnected = set()
        for connection in self.active_connections[tenant_id]:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                disconnected.add(connection)
            except Exception as e:
                logger.error(f"Error broadcasting to tenant {tenant_id}: {e}")
                disconnected.add(connection)

        # Clean up disconnected clients
        for connection in disconnected:
            self.disconnect(connection, tenant_id)

    async def send_progress_update(
        self,
        tenant_id: str,
        operation_id: str,
        status: str,
        progress: int,
        message: str,
        data: Dict = None
    ):
        """Send progress update to tenant"""
        update = ProgressUpdate(
            operation_id=operation_id,
            status=status,
            progress=progress,
            message=message,
            data=data or {}
        )
        await self.broadcast_to_tenant(tenant_id, update.to_dict())


# Global connection manager
manager = ConnectionManager()
