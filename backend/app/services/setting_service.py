# app/services/setting_service.py
"""Setting Service."""

from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.setting_repository import SettingRepository
from app.schemas.setting import SettingResponse, SettingUpdate


class SettingService:
    def __init__(self, session: AsyncSession):
        self.repo = SettingRepository(session)

    async def get_settings(self, user_id: int, category: str = "general"):
        settings = await self.repo.get_by_user(user_id, category=category)
        return [SettingResponse.model_validate(s) for s in settings]

    async def update_settings(self, user_id: int, payload: SettingUpdate):
        updated = []
        for key, val in payload.settings.items():
            existing = await self.repo.get_by_user(user_id, category=payload.category)
            match = next((item for item in existing if item.key == key), None)
            if match:
                item = await self.repo.update(match, value=str(val))
            else:
                item = await self.repo.create(
                    user_id=user_id,
                    category=payload.category,
                    key=key,
                    value=str(val),
                )
            updated.append(SettingResponse.model_validate(item))
        return updated
