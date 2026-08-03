# app/schemas/api_key.py
"""Pydantic schemas for API Key management."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class APIKeyCreate(BaseModel):
    """Payload to generate a new API key."""

    name: str = Field(..., min_length=1, max_length=100)
    scopes: str = Field(default="read,write")
    expires_in_days: Optional[int] = Field(default=30)


class APIKeyResponse(BaseModel):
    """API key response DTO."""

    id: int
    name: str
    key_prefix: str
    api_key: Optional[str] = None
    scopes: str
    expires_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
