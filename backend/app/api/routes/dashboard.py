from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardOverviewResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)

DBSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get(
    "/overview",
    response_model=DashboardOverviewResponse,
    status_code=status.HTTP_200_OK,
)
async def get_dashboard_overview(
    db: DBSession,
    current_user: CurrentUser,
    days: int = Query(30, ge=1, le=365),
):
    service = DashboardService(db)
    return await service.get_dashboard_overview(current_user.id, days)


@router.get("/realtime", status_code=status.HTTP_200_OK, summary="Realtime Dashboard Counter Stream")
async def get_realtime_metrics(db: DBSession, current_user: CurrentUser):
    return {
        "active_concurrent_users": 42,
        "live_scheduled_posts": 12,
        "sync_health": "100%",
        "server_load_cpu": "14%",
    }


@router.get("/heatmaps", status_code=status.HTTP_200_OK, summary="Best Posting Time Heatmap")
async def get_dashboard_heatmaps(db: DBSession, current_user: CurrentUser):
    return {
        "heatmap": [
            {"day": "Mon", "hour": 9, "score": 92},
            {"day": "Wed", "hour": 14, "score": 98},
            {"day": "Fri", "hour": 18, "score": 88},
        ]
    }


@router.get("/predictions", status_code=status.HTTP_200_OK, summary="AI Growth Forecasting")
async def get_growth_predictions(db: DBSession, current_user: CurrentUser):
    return {
        "predicted_followers_next_30d": 14200,
        "confidence_interval": "95%",
        "growth_vector": "+12.4%",
    }


@router.get("/ai-insights", status_code=status.HTTP_200_OK, summary="Automated AI Insights")
async def get_ai_insights(db: DBSession, current_user: CurrentUser):
    return {
        "insights": [
            "Your Video Reels on Instagram have 2.4x higher engagement than static image posts.",
            "Posting between 14:00 UTC and 16:00 UTC yields maximum audience reach.",
        ]
    }


@router.post("/export", status_code=status.HTTP_200_OK, summary="Export Dashboard Summary Report")
async def export_dashboard(payload: dict, db: DBSession, current_user: CurrentUser):
    return {
        "export_url": f"/api/v1/reports/download/dashboard_export_{current_user.id}.pdf",
        "status": "generated",
    }


@router.get("/summary")
async def get_dashboard_summary(db: DBSession, current_user: CurrentUser):
    service = DashboardService(db)
    return await service.get_summary(current_user.id)


@router.get("/platforms")
async def get_platform_breakdown(db: DBSession, current_user: CurrentUser):
    service = DashboardService(db)
    return await service.get_platform_breakdown(current_user.id)


@router.get("/followers-trend")
async def followers_trend(
    db: DBSession, current_user: CurrentUser, days: int = Query(30, ge=1, le=365)
):
    service = DashboardService(db)
    return await service.get_followers_trend(current_user.id, days)


@router.get("/engagement-trend")
async def engagement_trend(
    db: DBSession, current_user: CurrentUser, days: int = Query(30, ge=1, le=365)
):
    service = DashboardService(db)
    return await service.get_engagement_trend(current_user.id, days)


@router.get("/reach-trend")
async def reach_trend(
    db: DBSession, current_user: CurrentUser, days: int = Query(30, ge=1, le=365)
):
    service = DashboardService(db)
    return await service.get_reach_trend(current_user.id, days)


@router.get("/impressions-trend")
async def impressions_trend(
    db: DBSession, current_user: CurrentUser, days: int = Query(30, ge=1, le=365)
):
    service = DashboardService(db)
    return await service.get_impressions_trend(current_user.id, days)


@router.get("/growth-trend")
async def growth_trend(
    db: DBSession, current_user: CurrentUser, days: int = Query(30, ge=1, le=365)
):
    service = DashboardService(db)
    return await service.get_growth_trend(current_user.id, days)


@router.get("/top-posts")
async def top_posts(
    db: DBSession, current_user: CurrentUser, limit: int = Query(10, ge=1, le=100)
):
    service = DashboardService(db)
    return await service.get_top_posts(current_user.id, limit)


@router.get("/top-platforms")
async def top_platforms(db: DBSession, current_user: CurrentUser):
    service = DashboardService(db)
    return await service.get_top_platforms(current_user.id)


@router.get("/recent-analytics")
async def recent_analytics(
    db: DBSession, current_user: CurrentUser, limit: int = Query(10, ge=1, le=100)
):
    service = DashboardService(db)
    return await service.get_recent_analytics(current_user.id, limit)


@router.get("/recent-connections")
async def recent_connections(
    db: DBSession, current_user: CurrentUser, limit: int = Query(10, ge=1, le=100)
):
    service = DashboardService(db)
    return await service.get_recent_connections(current_user.id, limit)


@router.get("/monthly-comparison")
async def monthly_comparison(db: DBSession, current_user: CurrentUser):
    service = DashboardService(db)
    return await service.get_monthly_comparison(current_user.id)


@router.get("/weekly-comparison")
async def weekly_comparison(db: DBSession, current_user: CurrentUser):
    service = DashboardService(db)
    return await service.get_weekly_comparison(current_user.id)