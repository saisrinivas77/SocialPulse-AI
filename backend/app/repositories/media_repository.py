# app/repositories/media_repository.py
"""Media repository implementation."""

from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.media import MediaAsset
from app.repositories.base import BaseRepository


class MediaRepository(BaseRepository[MediaAsset]):
    """Data access layer for MediaAssets."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(MediaAsset, session)

    async def get_by_ids_and_workspace(
        self, media_ids: Sequence[int], workspace_id: int
    ) -> Sequence[MediaAsset]:
        """Fetch valid media assets owned by workspace."""
        stmt = select(MediaAsset).where(
            MediaAsset.id.in_(media_ids),
            MediaAsset.workspace_id == workspace_id,
        )
        result = await self.session.execute(stmt)
        return result.scalars().all()