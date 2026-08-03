from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

# =========================
# KPI Cards
# =========================

class DashboardKPIs(BaseModel):
    total_accounts: int = Field(..., ge=0)
    total_posts: int = Field(..., ge=0)
    total_followers: int = Field(..., ge=0)
    total_following: int = Field(..., ge=0)
    average_engagement_rate: Decimal = Field(..., ge=0)
    average_growth_rate: Decimal
    model_config = ConfigDict(from_attributes=True)

# =========================
# Platform Overview
# =========================

class PlatformOverview(BaseModel):
    platform: str
    accounts: int = Field(..., ge=0)
    followers: int = Field(..., ge=0)
    posts: int = Field(..., ge=0)
    engagement_rate: Decimal = Field(..., ge=0)
    model_config = ConfigDict(from_attributes=True)

# =========================
# Trend Point
# =========================

class TrendPoint(BaseModel):
    timestamp: datetime
    value: Decimal
    model_config = ConfigDict(from_attributes=True)

# =========================
# Recent Activity
# =========================

class RecentActivity(BaseModel):
    id: int
    title: Optional[str] = None
    platform: str
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# =========================
# Top Posts
# =========================

class TopPost(BaseModel):
    id: int
    title: str
    engagement_rate: Decimal
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# =========================
# Connections
# =========================

class Connection(BaseModel):
    id: int
    platform: str
    username: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# =========================
# Comparisons
# =========================

class MonthlyComparison(BaseModel):
    year: int
    month: int
    followers: int
    model_config = ConfigDict(from_attributes=True)

class WeeklyComparison(BaseModel):
    year: int
    week: int
    followers: int
    model_config = ConfigDict(from_attributes=True)

# =========================
# Dashboard Overview
# =========================

class DashboardOverviewResponse(BaseModel):
    kpis: DashboardKPIs
    platform_breakdown: list[PlatformOverview]
    follower_trend: list[TrendPoint]
    engagement_trend: list[TrendPoint]
    recent_posts: list[RecentActivity]
    model_config = ConfigDict(from_attributes=True)
