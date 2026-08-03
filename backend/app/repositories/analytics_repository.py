# app/repositories/analytics_repository.py

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from sqlalchemy import and_, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import Analytics
from app.repositories.base import BaseRepository


class AnalyticsRepository(BaseRepository[Analytics]):
    """
    Repository for Analytics persistence.
    """

    def __init__(self, session: AsyncSession):
        super().__init__(Analytics, session)

    # ==========================================================
    # Create
    # ==========================================================

    async def create_analytics(
        self,
        **data,
    ) -> Analytics:
        return await self.create(**data)

    # ==========================================================
    # Get By ID
    # ==========================================================

    async def get_by_user_and_id(
        self,
        user_id: Any,
        analytics_id: Any,
    ) -> Optional[Analytics]:

        stmt = select(Analytics).where(
            and_(
                Analytics.id == analytics_id,
                Analytics.user_id == user_id,
            )
        )

        result = await self.session.execute(stmt)

        return result.scalar_one_or_none()

    # ==========================================================
    # Get Latest Snapshot
    # ==========================================================

    async def get_latest_by_social_account(
        self,
        social_account_id: Any,
    ) -> Optional[Analytics]:

        stmt = (
            select(Analytics)
            .where(
                Analytics.social_account_id == social_account_id
            )
            .order_by(desc(Analytics.recorded_at))
            .limit(1)
        )

        result = await self.session.execute(stmt)

        return result.scalar_one_or_none()

    # ==========================================================
    # List User Analytics
    # ==========================================================

    async def list_user_analytics(
        self,
        *,
        user_id: Any,
        page: int = 1,
        page_size: int = 20,
        platform: str | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ):

        stmt = select(Analytics).where(
            Analytics.user_id == user_id
        )

        if platform:
            stmt = stmt.where(
                Analytics.platform == platform
            )

        if start_date:
            stmt = stmt.where(
                Analytics.recorded_at >= start_date
            )

        if end_date:
            stmt = stmt.where(
                Analytics.recorded_at <= end_date
            )

        count_stmt = select(func.count()).select_from(
            stmt.subquery()
        )

        total = (
            await self.session.execute(count_stmt)
        ).scalar_one()

        stmt = (
            stmt.order_by(desc(Analytics.recorded_at))
            .offset((page - 1) * page_size)
            .limit(page_size)
        )

        result = await self.session.execute(stmt)

        return result.scalars().all(), total

    # ==========================================================
    # Update
    # ==========================================================

    async def update_analytics(
        self,
        analytics: Analytics,
        **data,
    ) -> Analytics:

        return await self.update(
            analytics,
            **data,
        )

    # ==========================================================
    # Delete
    # ==========================================================

    async def delete_analytics(
        self,
        analytics: Analytics,
    ):

        await self.soft_delete(analytics)

    # ==========================================================
    # Dashboard Statistics
    # ==========================================================

    async def dashboard_summary(
        self,
        user_id: Any,
    ) -> dict:

        stmt = select(
            func.sum(Analytics.followers),
            func.sum(Analytics.likes),
            func.sum(Analytics.comments),
            func.sum(Analytics.shares),
            func.avg(Analytics.engagement_rate),
            func.avg(Analytics.growth_rate),
        ).where(
            Analytics.user_id == user_id
        )

        result = await self.session.execute(stmt)

        row = result.one()

        return {
            "followers": row[0] or 0,
            "likes": row[1] or 0,
            "comments": row[2] or 0,
            "shares": row[3] or 0,
            "avg_engagement": float(row[4] or 0),
            "avg_growth": float(row[5] or 0),
        }

    # ==========================================================
    # Platform Summary
    # ==========================================================

    async def platform_summary(
        self,
        user_id: Any,
    ):

        stmt = (
            select(
                Analytics.platform,
                func.sum(Analytics.followers),
                func.sum(Analytics.likes),
                func.avg(Analytics.engagement_rate),
            )
            .where(
                Analytics.user_id == user_id
            )
            .group_by(
                Analytics.platform
            )
        )

        result = await self.session.execute(stmt)

        return [
            {
                "platform": row[0],
                "followers": row[1],
                "likes": row[2],
                "engagement_rate": float(row[3] or 0),
            }
            for row in result.all()
        ]