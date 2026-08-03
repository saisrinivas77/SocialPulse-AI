from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field
from app.models.social_account import PlatformType


# ==========================================
# Platform Enum
# ==========================================

class Platform(str, Enum):
    INSTAGRAM = "Instagram"
    FACEBOOK = "Facebook"
    LINKEDIN = "LinkedIn"
    X = "X"
    YOUTUBE = "YouTube"
    TIKTOK = "TikTok"


# ==========================================
# Base Schema
# ==========================================

class AnalyticsBase(BaseModel):
    platform: Platform = Field(
        ...,
        description="Social media platform.",
    )

    followers: int = Field(
        default=0,
        ge=0,
        description="Total followers.",
    )

    following: int = Field(
        default=0,
        ge=0,
        description="Total accounts being followed.",
    )

    posts: int = Field(
        default=0,
        ge=0,
        description="Total number of posts.",
    )

    likes: int = Field(
        default=0,
        ge=0,
        description="Total likes received.",
    )

    comments: int = Field(
        default=0,
        ge=0,
        description="Total comments received.",
    )

    shares: int = Field(
        default=0,
        ge=0,
        description="Total shares.",
    )

    views: int = Field(
        default=0,
        ge=0,
        description="Total views.",
    )

    reach: int = Field(
        default=0,
        ge=0,
        description="Total unique accounts reached.",
    )

    impressions: int = Field(
        default=0,
        ge=0,
        description="Total impressions.",
    )

    profile_visits: int = Field(
        default=0,
        ge=0,
        description="Number of profile visits.",
    )

    website_clicks: int = Field(
        default=0,
        ge=0,
        description="Number of website clicks.",
    )

    recorded_at: datetime | None = Field(
        default=None,
        description="Date and time when analytics were recorded.",
    )


# ==========================================
# Create Schema
# ==========================================

class AnalyticsCreate(AnalyticsBase):
    social_account_id: int = Field(
        ...,
        description="Connected social account ID.",
    )


# ==========================================
# Update Schema
# ==========================================

class AnalyticsUpdate(BaseModel):
    followers: int | None = Field(
        default=None,
        ge=0,
        description="Updated followers count.",
    )

    following: int | None = Field(
        default=None,
        ge=0,
        description="Updated following count.",
    )

    posts: int | None = Field(
        default=None,
        ge=0,
        description="Updated posts count.",
    )

    likes: int | None = Field(
        default=None,
        ge=0,
        description="Updated likes count.",
    )

    comments: int | None = Field(
        default=None,
        ge=0,
        description="Updated comments count.",
    )

    shares: int | None = Field(
        default=None,
        ge=0,
        description="Updated shares count.",
    )

    views: int | None = Field(
        default=None,
        ge=0,
        description="Updated views count.",
    )

    reach: int | None = Field(
        default=None,
        ge=0,
        description="Updated reach count.",
    )

    impressions: int | None = Field(
        default=None,
        ge=0,
        description="Updated impressions count.",
    )

    profile_visits: int | None = Field(
        default=None,
        ge=0,
        description="Updated profile visits.",
    )

    website_clicks: int | None = Field(
        default=None,
        ge=0,
        description="Updated website clicks.",
    )

    recorded_at: datetime | None = Field(
        default=None,
        description="Updated analytics recording time.",
    )

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# Response Schema
# ==========================================

class AnalyticsResponse(AnalyticsBase):
    id: int = Field(
        description="Analytics record ID.",
    )

    uuid: str = Field(
        description="Unique analytics UUID.",
    )

    user_id: int = Field(
        description="Owner user ID.",
    )

    social_account_id: int = Field(
        description="Connected social account ID.",
    )

    engagement_rate: float = Field(
        ge=0,
        description="Calculated engagement rate (%).",
    )

    growth_rate: float = Field(
        description="Follower growth rate (%). Can be negative if followers decrease.",
    )

    created_at: datetime = Field(
        description="Analytics record creation timestamp.",
    )

    updated_at: datetime = Field(
        description="Last analytics update timestamp.",
    )

    model_config = ConfigDict(from_attributes=True)