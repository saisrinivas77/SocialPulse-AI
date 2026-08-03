# app/services/notification_service.py
"""Notification Service."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationCreate, NotificationResponse


class NotificationService:
    def __init__(self, session: AsyncSession):
        self.repo = NotificationRepository(session)

    async def get_user_notifications(self, user_id: int):
        notifications = await self.repo.get_user_notifications(user_id)
        return [NotificationResponse.model_validate(n) for n in notifications]

    async def create_notification(self, user_id: int, payload: NotificationCreate):
        notification = await self.repo.create(
            user_id=user_id,
            title=payload.title,
            message=payload.message,
            notification_type=payload.notification_type,
        )
        return NotificationResponse.model_validate(notification)

    async def mark_as_read(self, notification_id: int, user_id: int):
        notification = await self.repo.mark_read(notification_id, user_id)
        if notification:
            return NotificationResponse.model_validate(notification)
        return None

    async def delete_notification(self, notification_id: int, user_id: int):
        notification = await self.repo.get_by_id(notification_id)
        if notification and notification.user_id == user_id:
            await self.repo.soft_delete(notification)
