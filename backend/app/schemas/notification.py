# app/schemas/notification.py
"""Pydantic schemas for Notification operations."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NotificationCreate(BaseModel):
    """Payload to create a notification."""

    title: str
    message: str
    notification_type: str = "info"


class NotificationResponse(BaseModel):
    """Notification response DTO."""

    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
