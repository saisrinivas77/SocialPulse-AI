# app/api/routes/websocket.py
"""WebSocket router for live notifications, telemetry streams, and team activity updates."""

import json
import asyncio
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["WebSocket Telemetry & Live Updates"])

class ConnectionManager:
    """Manages active WebSocket connections across client sessions."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

ws_manager = ConnectionManager()

@router.websocket("/notifications")
async def websocket_notifications_endpoint(websocket: WebSocket):
    """Real-time live notification stream."""
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({
            "type": "INITIAL_HANDSHAKE",
            "message": "Connected to SocialPulse AI Real-time Telemetry Stream",
            "active_nodes": len(ws_manager.active_connections)
        })
        while True:
            data = await websocket.receive_text()
            # Echo back keep-alive ping
            await websocket.send_json({"type": "PONG", "payload": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@router.websocket("/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """Real-time telemetry metric broadcast."""
    await ws_manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(10)
            await websocket.send_json({
                "type": "TELEMETRY_UPDATE",
                "followers_delta": "+12",
                "reach_live": 2450820,
                "active_campaigns": 4,
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
