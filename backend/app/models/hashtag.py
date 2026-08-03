# app/models/hashtag.py
"""Hashtag ORM model for AI-generated hashtag suggestions."""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Hashtag(Base):
    """AI-generated hashtag record."""

    __tablename__ = "hashtags"

    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    hashtag: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
