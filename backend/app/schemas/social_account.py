# app/schemas/social_account.py
"""Pydantic schemas for Social Accounts."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.social_account import PlatformType


class SocialAccountCreate(BaseModel):
    """Payload for connecting a new social platform channel."""

    platform: PlatformType = Field(...)
    account_name: str = Field(..., min_length=1, max_length=255)
    account_handle: str = Field(..., min_length=1, max_length=255)
    external_account_id: str = Field(..., min_length=1, max_length=255)
    access_token: str = Field(..., min_length=1)
    refresh_token: Optional[str] = Field(default=None)
    token_expires_at: Optional[datetime] = Field(default=None)


class SocialAccountResponse(BaseModel):
    """Response format for connected social accounts."""

    id: int
    workspace_id: int
    platform: PlatformType
    account_name: str
    account_handle: str
    external_account_id: str
    token_expires_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)