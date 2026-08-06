# app/models/oauth_account.py
"""OAuth Account ORM model for multi-provider user authentication & automatic account linking."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class OAuthAccount(Base):
    """Stores connected authentication providers (Google, GitHub, Microsoft, LinkedIn) for a User."""

    __tablename__ = "oauth_accounts"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    provider: Mapped[str] = mapped_column(
        String(50), nullable=False, index=True
    )
    provider_user_id: Mapped[str] = mapped_column(
        String(255), nullable=False, index=True
    )
    provider_email: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True
    )
    provider_username: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    provider_avatar: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True
    )
    encrypted_access_token: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True
    )
    encrypted_refresh_token: Mapped[Optional[str]] = mapped_column(
        Text, nullable=True
    )
    expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    connected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    last_login: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    is_primary: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="oauth_accounts")
