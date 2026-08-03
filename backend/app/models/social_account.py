# app/models/social_account.py
"""Social Account ORM model scoped to Workspace multi-tenant boundary."""

import enum
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
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