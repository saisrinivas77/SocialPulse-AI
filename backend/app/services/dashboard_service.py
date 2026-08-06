from __future__ import annotations

from datetime import datetime, timedelta, timezone
from decimal import Decimal

import structlog
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundException
from app.repositories.dashboard_repository import DashboardRepository
from app.services.cache_service import cache_service
from app.schemas.dashboard import (
    DashboardKPIs,
    DashboardOverviewResponse,
    PlatformOverview,
    RecentActivity,
    TrendPoint,
)

logger = structlog.get_logger()


class DashboardService:
    """
    Dashboard Service

    Business logic layer for dashboard APIs.
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repository = DashboardRepository(session)

    # ==========================================================
    # Helpers
    # ==========================================================

    @staticmethod
    def _build_kpis(data: dict) -> DashboardKPIs:
        return DashboardKPIs(
            total_accounts=data["total_accounts"],
            total_posts=data["total_posts"],
            total_followers=data["total_followers"],
            total_following=data["total_following"],
            average_engagement_rate=Decimal(
                str(data["average_engagement_rate"] or 0)
            ),
            average_growth_rate=Decimal(
                str(data["average_growth_rate"] or 0)
            ),
        )

    @staticmethod
    def _platforms(rows):
        result = []

        for (
            platform,
            accounts,
            followers,
            posts,
            engagement_rate,
        ) in rows:

            result.append(
                PlatformOverview(
                    platform=platform,
                    accounts=accounts,
                    followers=followers,
                    posts=posts,
                    engagement_rate=Decimal(
                        str(round(float(engagement_rate or 0), 2))
                    ),
                )
            )

        return result

    @staticmethod
    def _trend(rows):
        return [
            TrendPoint(
                timestamp=row[0],
                value=Decimal(
                    str(round(float(row[1] or 0), 2))
                ),
            )
            for row in rows
        ]

    @staticmethod
    def _recent_posts(rows):
        return [
            RecentActivity(
                id=row[0],
                title=row[1],
                platform=row[2],
                status=row[3],
                created_at=row[4],
            )
            for row in rows
        ]

    # ==========================================================
    # Dashboard Overview
    # ==========================================================

    async def get_dashboard_overview(
        self,
        user_id,
        days: int = 30,
    ) -> DashboardOverviewResponse:

        days = max(1, min(days, 365))

        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        logger.info(
            "dashboard.overview",
            user_id=user_id,
            days=days,
        )

        cache_key = cache_service.user_dashboard_key(user_id)
        cached_data = await cache_service.get(cache_key)
        if cached_data:
            try:
                return DashboardOverviewResponse.model_validate(cached_data)
            except Exception:
                pass

        summary = await self.repository.get_dashboard_summary(
            user_id
        )

        if summary is None:
            raise NotFoundException(
                "Dashboard data not found."
            )

        platforms = (
            await self.repository.get_platform_breakdown(
                user_id
            )
        )

        follower_trend = (
            await self.repository.get_followers_trend(
                user_id,
                start_date,
                end_date,
            )
        )

        engagement_trend = (
            await self.repository.get_engagement_trend(
                user_id,
                start_date,
                end_date,
            )
        )

        recent_posts = (
            await self.repository.get_recent_posts(
                user_id,
                limit=5,
            )
        )

        response = DashboardOverviewResponse(
            kpis=self._build_kpis(summary),
            platform_breakdown=self._platforms(
                platforms
            ),
            follower_trend=self._trend(
                follower_trend
            ),
            engagement_trend=self._trend(
                engagement_trend
            ),
            recent_posts=self._recent_posts(
                recent_posts
            ),
        )

        # Cache in Redis with 10-minute TTL
        await cache_service.set(cache_key, response.model_dump(mode="json"))
        return response
        # ==========================================================
    # Additional Trend APIs
    # ==========================================================

    async def get_reach_trend(
        self,
        user_id,
        days: int = 30,
    ):
        days = max(1, min(days, 365))

        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        rows = await self.repository.get_reach_trend(
            user_id,
            start_date,
            end_date,
        )

        return self._trend(rows)

    async def get_impressions_trend(
        self,
        user_id,
        days: int = 30,
    ):
        days = max(1, min(days, 365))

        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        rows = await self.repository.get_impressions_trend(
            user_id,
            start_date,
            end_date,
        )

        return self._trend(rows)

    async def get_growth_trend(
        self,
        user_id,
        days: int = 30,
    ):
        days = max(1, min(days, 365))

        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        rows = await self.repository.get_growth_trend(
            user_id,
            start_date,
            end_date,
        )

        return self._trend(rows)

    # ==========================================================
    # Top Posts
    # ==========================================================

    async def get_top_posts(
        self,
        user_id,
        limit: int = 10,
    ):
        posts = await self.repository.get_top_posts(
            user_id,
            limit,
        )

        return posts

    # ==========================================================
    # Top Platforms
    # ==========================================================

    async def get_top_platforms(
        self,
        user_id,
    ):
        rows = await self.repository.get_top_platforms(
            user_id
        )

        return [
            PlatformOverview(
                platform=row[0],
                accounts=0,
                followers=row[1],
                posts=0,
                engagement_rate=Decimal("0"),
            )
            for row in rows
        ]

    # ==========================================================
    # Recent Analytics
    # ==========================================================

    async def get_recent_analytics(
        self,
        user_id,
        limit: int = 10,
    ):
        return await self.repository.get_recent_analytics(
            user_id,
            limit,
        )

    # ==========================================================
    # Recent Connections
    # ==========================================================

    async def get_recent_connections(
        self,
        user_id,
        limit: int = 10,
    ):
        return await self.repository.get_recent_connections(
            user_id,
            limit,
        )
        # ==========================================================
    # Monthly Comparison
    # ==========================================================

    async def get_monthly_comparison(
        self,
        user_id,
    ):
        logger.info(
            "dashboard.monthly_comparison",
            user_id=user_id,
        )

        rows = await self.repository.get_monthly_comparison(
            user_id
        )

        return rows

    # ==========================================================
    # Weekly Comparison
    # ==========================================================

    async def get_weekly_comparison(
        self,
        user_id,
    ):
        logger.info(
            "dashboard.weekly_comparison",
            user_id=user_id,
        )

        rows = await self.repository.get_weekly_comparison(
            user_id
        )

        return rows

    # ==========================================================
    # Dashboard Summary Cards
    # ==========================================================

    async def get_summary(
        self,
        user_id,
    ):
        logger.info(
            "dashboard.summary",
            user_id=user_id,
        )

        return await self.repository.get_dashboard_summary(
            user_id
        )

    # ==========================================================
    # Platform Breakdown
    # ==========================================================

    async def get_platform_breakdown(
        self,
        user_id,
    ):
        rows = await self.repository.get_platform_breakdown(
            user_id
        )

        return self._platforms(rows)

    # ==========================================================
    # Followers Trend
    # ==========================================================

    async def get_followers_trend(
        self,
        user_id,
        days: int = 30,
    ):
        days = max(1, min(days, 365))

        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        rows = await self.repository.get_followers_trend(
            user_id,
            start_date,
            end_date,
        )

        return self._trend(rows)

    # ==========================================================
    # Engagement Trend
    # ==========================================================

    async def get_engagement_trend(
        self,
        user_id,
        days: int = 30,
    ):
        days = max(1, min(days, 365))

        end_date = datetime.now(timezone.utc)
        start_date = end_date - timedelta(days=days)

        rows = await self.repository.get_engagement_trend(
            user_id,
            start_date,
            end_date,
        )

        return self._trend(rows)