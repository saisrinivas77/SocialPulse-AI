# app/models/sync_log.py
"""ORM models for telemetry sync logs and token refresh audit history."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.social_account import SocialAccount
    from app.models.user import User


class SyncLog(Base):
    """Audit log record for background platform telemetry sync jobs."""

    __tablename__ = "sync_logs"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    social_account_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(50), default="SUCCESS", nullable=False
    )  # SUCCESS, FAILED, RATE_LIMITED, PARTIAL
    records_synced: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    duration_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True
    )

    user: Mapped["User"] = relationship("User")
    social_account: Mapped["SocialAccount"] = relationship("SocialAccount")


class TokenRefreshLog(Base):
    """Audit log for OAuth access & refresh token renewal attempts."""

    __tablename__ = "token_refresh_logs"

    social_account_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(50), default="REFRESHED", nullable=False
    )  # REFRESHED, EXPIRED, FAILED
    attempts: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True
    )

    social_account: Mapped["SocialAccount"] = relationship("SocialAccount")
