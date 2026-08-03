"""Analytics model for aggregated social platform metrics."""

from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, Float, ForeignKey, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.social_account import PlatformType


class Analytics(Base):
    """Persisted analytics record for a connected social account."""

    __tablename__ = "analytics"

    __table_args__ = (
        Index(
            "ix_analytics_user_platform_recorded_at",
            "user_id",
            "platform",
            "recorded_at",
        ),
        Index(
            "ix_analytics_platform_recorded_at",
            "platform",
            "recorded_at",
        ),
    )

    uuid: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False,
        default=lambda: str(uuid4()),
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    social_account_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[PlatformType] = mapped_column(
        String(20), nullable=False, index=True
    )

    followers: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    following: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    posts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    likes: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    comments: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    shares: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    views: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    reach: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    impressions: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    profile_visits: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    website_clicks: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    engagement_rate: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    growth_rate: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship("User", back_populates="analytics", lazy="joined")
    social_account = relationship(
        "SocialAccount", back_populates="analytics", lazy="joined"
    )