# app/schemas/post.py
"""Pydantic schemas for Post models."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.post import PostStatus
from app.schemas.media import MediaAssetResponse
from app.schemas.pagination import PaginationParams


class PostScheduleRequest(BaseModel):
    """Payload for scheduling a post publication."""

    scheduled_at: datetime = Field(
        ...,
        description="Target UTC timestamp for scheduling post.",
        examples=["2026-08-15T14:30:00Z"],
    )


class PostQueryParams(PaginationParams):
    """Extended post query parameter model."""

    status: Optional[PostStatus] = Field(default=None)
    social_account_id: Optional[int] = Field(default=None)
    date_from: Optional[datetime] = Field(default=None)
    date_to: Optional[datetime] = Field(default=None)


class PostCreate(BaseModel):
    """Post creation model."""

    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    status: PostStatus = Field(default=PostStatus.DRAFT)
    scheduled_at: Optional[datetime] = Field(default=None)
    social_account_id: Optional[int] = Field(default=None)
    media_ids: Optional[List[int]] = Field(default_factory=list)


class PostUpdate(BaseModel):
    """Post update model."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    content: Optional[str] = Field(default=None, min_length=1)
    status: Optional[PostStatus] = Field(default=None)
    scheduled_at: Optional[datetime] = Field(default=None)
    social_account_id: Optional[int] = Field(default=None)
    media_ids: Optional[List[int]] = Field(default=None)


class PostResponse(BaseModel):
    """Serialized post representation."""

    id: int
    workspace_id: int
    social_account_id: Optional[int] = None
    title: str
    content: str
    status: PostStatus
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    media_assets: List[MediaAssetResponse] = []

    model_config = ConfigDict(from_attributes=True)