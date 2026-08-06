# app/services/websocket_manager.py
"""Central WebSocket Connection Manager for Real-Time Event Broadcasting."""

import logging
import asyncio
from typing import List, Dict, Any
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger(__name__)


class WebSocketManager:
    """Manages WebSocket connections and broadcasts real-time telemetry events to client dashboards."""

    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Active nodes: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Remaining nodes: {len(self.active_connections)}")

    async def broadcast_event(self, event: str, data: Dict[str, Any]) -> None:
        """Broadcast structured event to all active WebSocket clients.

        Supported events:
        - analytics.updated
        - account.connected
        - account.disconnected
        - sync.started
        - sync.completed
        - sync.failed
        - report.generated
        - notification.created
        """
        payload = {
            "event": event,
            "data": data,
        }
        for connection in list(self.active_connections):
            try:
                await connection.send_json(payload)
            except Exception as exc:
                logger.debug(f"Failed to send WS message: {exc}")
                self.disconnect(connection)


ws_manager = WebSocketManager()
