# app/repositories/notification_repository.py
"""Notification Repository."""

from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, session: AsyncSession):
        super().__init__(Notification, session)

    async def get_user_notifications(self, user_id: int) -> Sequence[Notification]:
        stmt = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
        )
        res = await self.session.execute(stmt)
        return res.scalars().all()

    async def mark_read(self, notification_id: int, user_id: int) -> Notification | None:
        notification = await self.get_by_id(notification_id)
        if notification and notification.user_id == user_id:
            notification.is_read = True
            await self.session.flush()
            return notification
        return None
