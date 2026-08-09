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
    user_id: Optional[int] = None
    workspace_id: int
    platform: PlatformType
    account_name: str
    account_handle: str
    external_account_id: str
    follower_count: int = 0
    reach_count: int = 0
    posts_count: int = 0
    engagement_rate: float = 0.0
    avatar_url: Optional[str] = None
    sync_health: int = 100
    status: str = "CONNECTED"
    connection_status: str = "CONNECTED"
    sync_status: str = "completed"
    last_sync_error: Optional[str] = None
    account_type: Optional[str] = "BUSINESS"
    token_status: str = "VALID"
    scopes: Optional[str] = None
    token_expires_at: Optional[datetime] = None
    last_synced_at: Optional[datetime] = None
    metadata_json: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    @property
    def provider(self) -> str:
        return self.platform.value if hasattr(self.platform, "value") else str(self.platform)

    @property
    def provider_account_id(self) -> str:
        return self.external_account_id

    @property
    def username(self) -> str:
        return self.account_handle

    @property
    def display_name(self) -> str:
        return self.account_name

    @property
    def profile_picture(self) -> Optional[str]:
        return self.avatar_url

    @property
    def connected_at(self) -> datetime:
        return self.created_at

    @property
    def last_sync(self) -> Optional[datetime]:
        return self.last_synced_at

    model_config = ConfigDict(from_attributes=True)