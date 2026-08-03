# app/models/report.py
"""Report ORM model for generated analytics export jobs."""

from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class Report(Base):
    """Generated Analytics Report artifact."""

    __tablename__ = "reports"

    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    report_type: Mapped[str] = mapped_column(String(50), nullable=False)
    format: Mapped[str] = mapped_column(String(10), default="pdf", nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="completed", nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="reports")
