# app/repositories/api_key_repository.py
"""API Key Repository."""

from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.api_key import APIKey
from app.repositories.base import BaseRepository


class APIKeyRepository(BaseRepository[APIKey]):
    def __init__(self, session: AsyncSession):
        super().__init__(APIKey, session)

    async def get_by_user(self, user_id: int) -> Sequence[APIKey]:
        stmt = select(APIKey).where(APIKey.user_id == user_id).order_by(APIKey.created_at.desc())
        res = await self.session.execute(stmt)
        return res.scalars().all()
