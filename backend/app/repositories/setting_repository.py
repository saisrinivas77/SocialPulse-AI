# app/repositories/setting_repository.py
"""Setting Repository."""

from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.setting import SystemSetting
from app.repositories.base import BaseRepository


class SettingRepository(BaseRepository[SystemSetting]):
    def __init__(self, session: AsyncSession):
        super().__init__(SystemSetting, session)

    async def get_by_user(self, user_id: int, category: str = "general") -> Sequence[SystemSetting]:
        stmt = select(SystemSetting).where(
            SystemSetting.user_id == user_id,
            SystemSetting.category == category,
        )
        res = await self.session.execute(stmt)
        return res.scalars().all()
