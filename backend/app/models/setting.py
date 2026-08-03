# app/models/setting.py
"""User and System Settings ORM model."""

from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class SystemSetting(Base):
    """KeyValue preferences storage for application, tenant, and user configurations."""

    __tablename__ = "settings"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    category: Mapped[str] = mapped_column(String(50), default="general", nullable=False, index=True)
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="settings")
