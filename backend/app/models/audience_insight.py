# app/models/audience_insight.py
"""ORM models for audience demographic insights and historical growth trajectory."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.social_account import SocialAccount
    from app.models.user import User


class AudienceInsight(Base):
    """Demographic and geographic audience analytics snapshot."""

    __tablename__ = "audience_insights"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    social_account_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    age_demographics_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    gender_demographics_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    top_countries_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    top_cities_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True
    )

    user: Mapped["User"] = relationship("User")
    social_account: Mapped["SocialAccount"] = relationship("SocialAccount")


class GrowthHistory(Base):
    """Historical telemetry delta tracking daily/weekly channel trajectory."""

    __tablename__ = "growth_history"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    social_account_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    platform: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    followers_delta: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reach_delta: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    engagement_delta: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False, index=True
    )

    user: Mapped["User"] = relationship("User")
    social_account: Mapped["SocialAccount"] = relationship("SocialAccount")
