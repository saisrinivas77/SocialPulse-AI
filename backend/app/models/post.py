# app/models/post.py
"""Post ORM model definition scoped to Workspace."""

import enum
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.media import MediaAsset
    from app.models.social_account import SocialAccount
    from app.models.user import User
    from app.models.workspace import Workspace


class PostStatus(str, enum.Enum):
    """Execution status for social posts."""

    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    PUBLISHED = "PUBLISHED"
    FAILED = "FAILED"
    ARCHIVED = "ARCHIVED"


class Post(Base):
    """Social media post record scoped to a workspace."""

    __tablename__ = "posts"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    workspace_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True
    )
    social_account_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("social_accounts.id", ondelete="SET NULL"), nullable=True, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[PostStatus] = mapped_column(
        Enum(PostStatus, name="post_status_enum"),
        default=PostStatus.DRAFT,
        nullable=False,
        index=True,
    )
    scheduled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )
    published_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    user: Mapped["User"] = relationship("User", back_populates="posts")
    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="posts")
    social_account: Mapped[Optional["SocialAccount"]] = relationship(
        "SocialAccount", back_populates="posts"
    )
    media_assets: Mapped[List["MediaAsset"]] = relationship(
        "MediaAsset", back_populates="post", cascade="all, delete-orphan"
    )