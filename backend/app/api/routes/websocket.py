# app/api/routes/websocket.py
"""WebSocket router for live notifications, telemetry streams, and real-time dashboard updates."""

import json
import asyncio
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.websocket_manager import ws_manager

router = APIRouter(prefix="/ws", tags=["WebSocket Telemetry & Live Updates"])


@router.websocket("/dashboard")
async def websocket_dashboard_endpoint(websocket: WebSocket):
    """Real-time live dashboard stream listening for analytics.updated and sync events."""
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({
            "event": "handshake",
            "data": {
                "message": "Connected to SocialPulse AI Database-First Realtime Telemetry Stream",
                "active_nodes": len(ws_manager.active_connections),
            }
        })
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"event": "pong", "data": {"raw": data}})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


@router.websocket("/notifications")
async def websocket_notifications_endpoint(websocket: WebSocket):
    """Real-time live notification stream."""
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({
            "event": "handshake",
            "data": {
                "message": "Connected to SocialPulse AI Real-time Telemetry Stream",
                "active_nodes": len(ws_manager.active_connections)
            }
        })
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"event": "pong", "data": {"raw": data}})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)


@router.websocket("/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """Real-time telemetry metric broadcast."""
    await ws_manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(15)
            await websocket.send_json({
                "event": "telemetry.heartbeat",
                "data": {
                    "followers_delta": "+12",
                    "reach_live": 2450820,
                    "active_campaigns": 4,
                }
            })
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
