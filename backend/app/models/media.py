# app/models/media.py
"""Media ORM asset for images and video attachments."""

import enum
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.post import Post
    from app.models.workspace import Workspace


class MediaType(str, enum.Enum):
    """Supported file media types."""

    IMAGE = "IMAGE"
    VIDEO = "VIDEO"


class MediaAsset(Base):
    """Stored media asset belonging to workspace and post."""

    __tablename__ = "media_assets"

    workspace_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True
    )
    post_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("posts.id", ondelete="SET NULL"), nullable=True, index=True
    )
    media_type: Mapped[MediaType] = mapped_column(
        Enum(MediaType, name="media_type_enum"), nullable=False
    )
    url: Mapped[str] = mapped_column(String(1024), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)

    workspace: Mapped["Workspace"] = relationship(
        "Workspace", back_populates="media_assets"
    )
    post: Mapped[Optional["Post"]] = relationship("Post", back_populates="media_assets")