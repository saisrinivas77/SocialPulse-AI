# app/models/social_account.py
"""Social Account ORM model scoped to Workspace multi-tenant boundary."""

import enum
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.analytics import Analytics
    from app.models.post import Post
    from app.models.user import User
    from app.models.workspace import Workspace


class PlatformType(str, enum.Enum):
    """Supported social network providers."""

    TWITTER = "TWITTER"
    LINKEDIN = "LINKEDIN"
    INSTAGRAM = "INSTAGRAM"
    FACEBOOK = "FACEBOOK"
    YOUTUBE = "YOUTUBE"
    TIKTOK = "TIKTOK"
    PINTEREST = "PINTEREST"
    THREADS = "THREADS"


class SocialAccount(Base):
    """OAuth social media account details bound to a workspace."""

    __tablename__ = "social_accounts"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    workspace_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[PlatformType] = mapped_column(
        Enum(PlatformType, name="platform_type_enum"),
        nullable=False,
        index=True,
    )
    account_name: Mapped[str] = mapped_column(String(255), nullable=False)
    account_handle: Mapped[str] = mapped_column(String(255), nullable=False)
    external_account_id: Mapped[str] = mapped_column(String(255), nullable=False)
    encrypted_access_token: Mapped[str] = mapped_column(Text, nullable=False)
    encrypted_refresh_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    token_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    follower_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reach_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    posts_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    engagement_rate: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    sync_health: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    health_score: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    rate_limit_remaining: Mapped[int] = mapped_column(Integer, default=5000, nullable=False)
    token_status: Mapped[str] = mapped_column(String(50), default="VALID", nullable=False)  # VALID, NEEDS_RECONNECTION, EXPIRED
    status: Mapped[str] = mapped_column(String(50), default="CONNECTED", nullable=False)
    last_synced_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    next_sync_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship("User", back_populates="social_accounts")
    workspace: Mapped["Workspace"] = relationship(
        "Workspace", back_populates="social_accounts"
    )
    analytics: Mapped[List["Analytics"]] = relationship(
        "Analytics", back_populates="social_account", cascade="all, delete-orphan"
    )
    posts: Mapped[List["Post"]] = relationship(
        "Post", back_populates="social_account", cascade="all, delete-orphan"
    )