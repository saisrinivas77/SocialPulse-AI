# app/api/routes/notifications.py
"""Notifications & Realtime WebSockets router."""

from typing import List
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications & Realtime WebSockets"])


@router.get(
    "",
    response_model=List[NotificationResponse],
    status_code=status.HTTP_200_OK,
    summary="Get user notifications",
)
async def get_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[NotificationResponse]:
    service = NotificationService(db)
    return await service.get_user_notifications(current_user.id)


@router.post(
    "",
    response_model=NotificationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create notification",
)
async def create_notification(
    payload: NotificationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> NotificationResponse:
    service = NotificationService(db)
    return await service.create_notification(current_user.id, payload)


@router.patch(
    "/{notification_id}/read",
    response_model=NotificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Mark notification as read",
)
async def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> NotificationResponse:
    service = NotificationService(db)
    res = await service.mark_as_read(notification_id, current_user.id)
    if not res:
        raise HTTPException(status_code=404, detail="Notification not found.")
    return res


@router.delete(
    "/{notification_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Dismiss notification",
)
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = NotificationService(db)
    await service.delete_notification(notification_id, current_user.id)


@router.websocket("/ws")
async def notification_websocket(websocket: WebSocket):
    """Realtime WebSocket endpoint for push alerts."""
    await websocket.accept()
    try:
        await websocket.send_json({"event": "connected", "message": "SocialPulse Realtime WebSocket active."})
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"event": "ack", "received": data})
    except WebSocketDisconnect:
        pass
