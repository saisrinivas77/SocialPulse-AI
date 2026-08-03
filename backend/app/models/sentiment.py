# app/models/sentiment.py
"""Sentiment ORM model for AI sentiment analysis results."""

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Sentiment(Base):
    """AI sentiment analysis result record."""

    __tablename__ = "sentiments"

    text: Mapped[str] = mapped_column(Text, nullable=False)
    label: Mapped[str] = mapped_column(String(50), nullable=False)
    score: Mapped[str] = mapped_column(String(20), nullable=False)
