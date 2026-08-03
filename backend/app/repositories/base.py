# app/repositories/base.py
"""Generic Base Repository abstraction."""

import logging
from typing import Any, Generic, Optional, Sequence, Type, TypeVar

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import Base
from app.utils.query_builder import QueryBuilder

logger = logging.getLogger(__name__)

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic repository delegating transaction management to get_db scope."""

    def __init__(self, model: Type[ModelType], session: AsyncSession) -> None:
        self.model = model
        self.session = session

    async def get_by_id(
        self, id: Any, include_deleted: bool = False
    ) -> Optional[ModelType]:
        """Fetch a record by primary key."""
        query = select(self.model).where(self.model.id == id)
        if hasattr(self.model, "is_deleted") and not include_deleted:
            col = getattr(self.model, "is_deleted")
            query = query.where(col.is_(False))

        result = await self.session.execute(query)
        return result.scalars().first()

    async def create(self, **data: Any) -> ModelType:
        """Create and persist a new model instance."""
        instance = self.model(**data)
        self.session.add(instance)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def update(self, instance: ModelType, **data: Any) -> ModelType:
        """Update existing model attributes."""
        for key, value in data.items():
            if hasattr(instance, key):
                setattr(instance, key, value)

        self.session.add(instance)
        await self.session.flush()
        await self.session.refresh(instance)
        return instance

    async def soft_delete(self, instance: ModelType) -> ModelType:
        """Soft delete model record."""
        if hasattr(instance, "is_deleted"):
            setattr(instance, "is_deleted", True)
            self.session.add(instance)
        else:
            await self.session.delete(instance)

        await self.session.flush()
        return instance

    async def list_paginated(
        self,
        builder: QueryBuilder[ModelType],
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[Sequence[ModelType], int]:
        """Execute built queries returning items and count metadata."""
        base_stmt = builder.build()

        count_stmt = select(func.count()).select_from(base_stmt.subquery())
        total_result = await self.session.execute(count_stmt)
        total = total_result.scalar_one_or_none() or 0

        offset = (page - 1) * page_size
        paginated_stmt = base_stmt.offset(offset).limit(page_size)

        exec_result = await self.session.execute(paginated_stmt)
        items = exec_result.scalars().all()

        return items, total