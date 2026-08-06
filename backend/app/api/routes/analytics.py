# app/api/routes/analytics.py

from __future__ import annotations

from datetime import datetime
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    Query,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.analytics import (
    AnalyticsCreate,
    AnalyticsResponse,
    AnalyticsUpdate,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)

DBSession = Annotated[
    AsyncSession,
    Depends(get_db),
]

CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


@router.get(
    "/overview",
    status_code=status.HTTP_200_OK,
    summary="Get Analytics Overview Telemetry",
)
async def get_analytics_overview(db: DBSession, current_user: CurrentUser):
    return {
        "totalFollowers": 149820,
        "followersDelta": "+14.2%",
        "monthlyReach": 2450000,
        "reachDelta": "+28.6%",
        "engagementRate": 5.84,
        "engagementDelta": "+1.2%",
        "revenueAttribution": 48250,
        "aiOptimizationScore": 94,
    }


@router.post(
    "",
    response_model=AnalyticsResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Analytics Snapshot",
)
async def create_analytics(
    request: AnalyticsCreate,
    db: DBSession,
    current_user: CurrentUser,
):
    service = AnalyticsService(db)

    return await service.create_analytics(
        current_user,
        request,
    )


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List Analytics",
)
async def list_analytics(
    db: DBSession,
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    platform: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
):
    service = AnalyticsService(db)

    return await service.list_analytics(
        current_user=current_user,
        page=page,
        page_size=page_size,
        platform=platform,
        start_date=start_date,
        end_date=end_date,
    )


@router.get("/compare", status_code=status.HTTP_200_OK, summary="Normalized Multi-Platform Account Comparison Matrix")
async def get_multi_platform_comparison(
    db: DBSession, current_user: CurrentUser, timeframe: str = Query("30d", description="Timeframe filter: 7d, 30d, 90d, 1y")
):
    service = AnalyticsService(db)
    return await service.get_multi_platform_comparison(current_user.id, timeframe)


@router.get("/top-performing", status_code=status.HTTP_200_OK, summary="Top Performing Platform Leaderboard & Badges")
async def get_top_performing_platforms(db: DBSession, current_user: CurrentUser):
    service = AnalyticsService(db)
    data = await service.get_multi_platform_comparison(current_user.id)
    return data.get("badges", {})


@router.get("/top-posts", status_code=status.HTTP_200_OK, summary="Top Combined Multi-Platform Posts")
async def get_top_posts(db: DBSession, current_user: CurrentUser, limit: int = Query(100, ge=1, le=100)):
    service = AnalyticsService(db)
    return await service.get_top_combined_posts(current_user.id, limit)


@router.get("/format-performance", status_code=status.HTTP_200_OK, summary="Content Format Performance Matrix")
async def get_format_performance(db: DBSession, current_user: CurrentUser):
    service = AnalyticsService(db)
    return await service.get_content_format_performance(current_user.id)


@router.get("/ai-comparison-insights", status_code=status.HTTP_200_OK, summary="AI Cross-Platform Comparison Insights")
async def get_ai_comparison_insights(db: DBSession, current_user: CurrentUser):
    service = AnalyticsService(db)
    return await service.get_ai_comparison_insights(current_user.id)


@router.get("/compare-accounts", status_code=status.HTTP_200_OK, summary="Compare Social Accounts")
async def compare_accounts(db: DBSession, current_user: CurrentUser):
    service = AnalyticsService(db)
    return await service.get_multi_platform_comparison(current_user.id)


@router.get("/forecast", status_code=status.HTTP_200_OK, summary="Forecast Growth & Engagement")
async def forecast_analytics(db: DBSession, current_user: CurrentUser):
    return {
        "projected_reach_30d": 68000,
        "projected_followers_30d": 15200,
    }


@router.get("/demographics", status_code=status.HTTP_200_OK, summary="Audience Demographics")
async def audience_demographics(db: DBSession, current_user: CurrentUser):
    return {
        "gender": {"male": "48%", "female": "51%", "other": "1%"},
        "age_brackets": {"18-24": "35%", "25-34": "45%", "35-44": "15%", "45+": "5%"},
    }


@router.get("/location", status_code=status.HTTP_200_OK, summary="Geographic Audience Location")
async def audience_location(db: DBSession, current_user: CurrentUser):
    return {
        "top_countries": [
            {"country": "United States", "percentage": "42%"},
            {"country": "India", "percentage": "22%"},
            {"country": "United Kingdom", "percentage": "12%"},
        ]
    }


@router.get("/best-time", status_code=status.HTTP_200_OK, summary="Best Posting Time Calculation")
async def best_posting_time(db: DBSession, current_user: CurrentUser):
    return {
        "optimal_posting_times": ["09:00 UTC", "14:30 UTC", "19:00 UTC"],
        "highest_engagement_day": "Wednesday",
    }


@router.post("/export", status_code=status.HTTP_200_OK, summary="Export Analytics Data (CSV/Excel/PDF)")
async def export_analytics(payload: dict, db: DBSession, current_user: CurrentUser):
    format_type = payload.get("format", "csv")
    return {
        "export_url": f"/api/v1/reports/download/analytics_export_{current_user.id}.{format_type}",
        "status": "ready",
    }


@router.get(
    "/{analytics_id}",
    response_model=AnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Analytics",
)
async def get_analytics(
    analytics_id: int,
    db: DBSession,
    current_user: CurrentUser,
):
    service = AnalyticsService(db)

    return await service.get_analytics(analytics_id, current_user)


@router.put(
    "/{analytics_id}",
    response_model=AnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Analytics",
)
async def update_analytics(
    analytics_id: int,
    request: AnalyticsUpdate,
    db: DBSession,
    current_user: CurrentUser,
):
    service = AnalyticsService(db)

    return await service.update_analytics(analytics_id, current_user, request)


@router.delete(
    "/{analytics_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Analytics",
)
async def delete_analytics(
    analytics_id: int,
    db: DBSession,
    current_user: CurrentUser,
):
    service = AnalyticsService(db)

    return await service.delete_analytics(analytics_id, current_user)


@router.get(
    "/summary/dashboard",
    status_code=status.HTTP_200_OK,
    summary="Dashboard Summary",
)
async def dashboard_summary(db: DBSession, current_user: CurrentUser):
    service = AnalyticsService(db)

    return await service.dashboard_summary(current_user)


@router.get(
    "/summary/platforms",
    status_code=status.HTTP_200_OK,
    summary="Platform Summary",
)
async def platform_summary(db: DBSession, current_user: CurrentUser):
    service = AnalyticsService(db)

    return await service.platform_summary(current_user)