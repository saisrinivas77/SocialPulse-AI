# app/database.py
"""SQLAlchemy async database engine and transactional session manager."""

import logging
import uuid
from datetime import datetime, timezone
from typing import AsyncGenerator

from sqlalchemy import DateTime, Integer, MetaData, String
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.config import settings

logger = logging.getLogger(__name__)

engine = create_async_engine(
    settings.ASYNC_SQLALCHEMY_DATABASE_URI,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=20,
    max_overflow=10,
)

AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Base declarative model providing primary key UUID and timestamp fields."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)

    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    uuid: Mapped[str] = mapped_column(
        String(36), unique=True, default=lambda: uuid.uuid4().hex, nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provide transactional session scope that commits or rolls back on failure."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            logger.error("Transaction rolled back", exc_info=True)
            raise