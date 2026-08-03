from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from app.models.analytics import Analytics
from app.models.post import Post
from app.models.social_account import SocialAccount
from app.repositories.base import BaseRepository


class DashboardRepository(BaseRepository[Analytics]):
    """
    Dashboard Repository
    Async SQLAlchemy 2.0 implementation.
    """

    def __init__(self, session: AsyncSession):
        super().__init__(Analytics, session)
        self.session = session

    # ==========================================================
    # Private Helper
    # ==========================================================

    async def _latest_analytics_subquery(
        self,
        user_id,
        platform: Optional[str] = None,
    ):
        latest = (
            select(
                Analytics.social_account_id,
                func.max(Analytics.recorded_at).label("max_recorded_at"),
            )
            .where(Analytics.user_id == user_id)
        )

        if platform:
            latest = latest.where(Analytics.platform == platform)

        latest = (
            latest.group_by(
                Analytics.social_account_id
            ).subquery()
        )

        analytics_alias = aliased(Analytics)

        latest_sub = (
            select(analytics_alias)
            .join(
                latest,
                and_(
                    analytics_alias.social_account_id
                    == latest.c.social_account_id,
                    analytics_alias.recorded_at
                    == latest.c.max_recorded_at,
                ),
            )
            .subquery()
        )

        return latest_sub

    # ==========================================================
    # Dashboard Summary
    # ==========================================================

    async def get_dashboard_summary(self, user_id):

        total_accounts_stmt = (
            select(func.count(SocialAccount.id))
            .where(
                SocialAccount.user_id == user_id,
            )
        )

        total_posts_stmt = (
            select(func.count(Post.id))
            .where(Post.user_id == user_id)
        )

        latest_sub = await self._latest_analytics_subquery(user_id)

        analytics_stmt = (
            select(
                func.coalesce(
                    func.sum(latest_sub.c.followers), 0
                ),
                func.coalesce(
                    func.sum(latest_sub.c.following), 0
                ),
                func.coalesce(
                    func.avg(latest_sub.c.engagement_rate), 0.0
                ),
                func.coalesce(
                    func.avg(latest_sub.c.growth_rate), 0.0
                ),
            )
        )

        total_accounts = (
            await self.session.scalar(total_accounts_stmt)
        ) or 0

        total_posts = (
            await self.session.scalar(total_posts_stmt)
        ) or 0

        analytics = (
            await self.session.execute(analytics_stmt)
        ).one()

        return {
            "total_accounts": int(total_accounts),
            "total_posts": int(total_posts),
            "total_followers": int(analytics[0]),
            "total_following": int(analytics[1]),
            "average_engagement_rate": round(
                float(analytics[2] or 0), 2
            ),
            "average_growth_rate": round(
                float(analytics[3] or 0), 2
            ),
        }

    # ==========================================================
    # Platform Breakdown
    # ==========================================================

    async def get_platform_breakdown(
        self,
        user_id,
    ):

        latest_sub = await self._latest_analytics_subquery(
            user_id
        )

        post_counts = (
            select(
                SocialAccount.platform,
                func.count(Post.id).label("total_posts"),
            )
            .join(
                Post,
                Post.social_account_id == SocialAccount.id,
            )
            .where(SocialAccount.user_id == user_id)
            .group_by(SocialAccount.platform)
            .subquery()
        )

        stmt = (
            select(
                latest_sub.c.platform.label("platform"),
                func.count(
                    latest_sub.c.social_account_id
                ).label("accounts"),
                func.coalesce(
                    func.sum(latest_sub.c.followers), 0
                ).label("followers"),
                func.coalesce(
                    post_counts.c.total_posts, 0
                ).label("posts"),
                func.coalesce(
                    func.avg(
                        latest_sub.c.engagement_rate
                    ),
                    0.0,
                ).label("engagement_rate"),
            )
            .outerjoin(
                post_counts,
                post_counts.c.platform
                == latest_sub.c.platform,
            )
            .group_by(
                latest_sub.c.platform,
                post_counts.c.total_posts,
            )
            .order_by(
                func.sum(
                    latest_sub.c.followers
                ).desc()
            )
        )

        result = await self.session.execute(stmt)

        return result.all()

    # ==========================================================
    # Trend Queries
    # ==========================================================

    async def get_followers_trend(
        self,
        user_id,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ):
        date_col = func.date(Analytics.recorded_at).label("record_date")

        stmt = (
            select(
                date_col,
                func.sum(Analytics.followers).label("value"),
            )
            .where(Analytics.user_id == user_id)
        )

        if start_date:
            stmt = stmt.where(Analytics.recorded_at >= start_date)

        if end_date:
            stmt = stmt.where(Analytics.recorded_at <= end_date)

        stmt = (
            stmt.group_by(date_col)
            .order_by(date_col.asc())
        )

        result = await self.session.execute(stmt)

        return [
            (
                datetime.combine(row[0], datetime.min.time()),
                float(row[1] or 0),
            )
            for row in result.all()
        ]

    async def get_engagement_trend(
        self,
        user_id,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ):
        date_col = func.date(Analytics.recorded_at).label("record_date")

        stmt = (
            select(
                date_col,
                func.avg(Analytics.engagement_rate).label("value"),
            )
            .where(Analytics.user_id == user_id)
        )

        if start_date:
            stmt = stmt.where(Analytics.recorded_at >= start_date)

        if end_date:
            stmt = stmt.where(Analytics.recorded_at <= end_date)

        stmt = (
            stmt.group_by(date_col)
            .order_by(date_col.asc())
        )

        result = await self.session.execute(stmt)

        return [
            (
                datetime.combine(row[0], datetime.min.time()),
                float(row[1] or 0),
            )
            for row in result.all()
        ]

    async def get_reach_trend(
        self,
        user_id,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ):
        date_col = func.date(Analytics.recorded_at).label("record_date")

        stmt = (
            select(
                date_col,
                func.sum(Analytics.reach).label("value"),
            )
            .where(Analytics.user_id == user_id)
        )

        if start_date:
            stmt = stmt.where(Analytics.recorded_at >= start_date)

        if end_date:
            stmt = stmt.where(Analytics.recorded_at <= end_date)

        stmt = (
            stmt.group_by(date_col)
            .order_by(date_col.asc())
        )

        result = await self.session.execute(stmt)

        return [
            (
                datetime.combine(row[0], datetime.min.time()),
                float(row[1] or 0),
            )
            for row in result.all()
        ]

    async def get_impressions_trend(
        self,
        user_id,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ):
        date_col = func.date(Analytics.recorded_at).label("record_date")

        stmt = (
            select(
                date_col,
                func.sum(Analytics.impressions).label("value"),
            )
            .where(Analytics.user_id == user_id)
        )

        if start_date:
            stmt = stmt.where(Analytics.recorded_at >= start_date)

        if end_date:
            stmt = stmt.where(Analytics.recorded_at <= end_date)

        stmt = (
            stmt.group_by(date_col)
            .order_by(date_col.asc())
        )

        result = await self.session.execute(stmt)

        return [
            (
                datetime.combine(row[0], datetime.min.time()),
                float(row[1] or 0),
            )
            for row in result.all()
        ]

    async def get_growth_trend(
        self,
        user_id,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ):
        date_col = func.date(Analytics.recorded_at).label("record_date")

        stmt = (
            select(
                date_col,
                func.avg(Analytics.growth_rate).label("value"),
            )
            .where(Analytics.user_id == user_id)
        )

        if start_date:
            stmt = stmt.where(Analytics.recorded_at >= start_date)

        if end_date:
            stmt = stmt.where(Analytics.recorded_at <= end_date)

        stmt = (
            stmt.group_by(date_col)
            .order_by(date_col.asc())
        )

        result = await self.session.execute(stmt)

        return [
            (
                datetime.combine(row[0], datetime.min.time()),
                float(row[1] or 0),
            )
            for row in result.all()
        ]

    # ==========================================================
    # Recent Posts
    # ==========================================================

    async def get_recent_posts(
        self,
        user_id,
        limit: int = 10,
    ):
        stmt = (
            select(
                Post.id,
                Post.title,
                SocialAccount.platform,
                Post.status,
                Post.created_at,
            )
            .join(
                SocialAccount,
                Post.social_account_id == SocialAccount.id,
            )
            .where(Post.user_id == user_id)
            .order_by(
                Post.created_at.desc(),
                Post.id.desc(),
            )
            .limit(limit)
        )

        result = await self.session.execute(stmt)
        return result.all()

    # ==========================================================
    # Top Posts
    # ==========================================================

    async def get_top_posts(
        self,
        user_id,
        limit: int = 10,
    ):
        stmt = (
            select(Post)
            .where(Post.user_id == user_id)
            .order_by(
                Post.created_at.desc(),
            )
            .limit(limit)
        )

        result = await self.session.execute(stmt)
        return result.scalars().all()

    # ==========================================================
    # Top Platforms
    # ==========================================================

    async def get_top_platforms(
        self,
        user_id,
    ):
        stmt = (
            select(
                Analytics.platform,
                func.sum(Analytics.followers).label(
                    "followers"
                ),
            )
            .where(Analytics.user_id == user_id)
            .group_by(Analytics.platform)
            .order_by(
                func.sum(
                    Analytics.followers
                ).desc()
            )
        )

        result = await self.session.execute(stmt)
        return result.all()

    # ==========================================================
    # Recent Analytics
    # ==========================================================

    async def get_recent_analytics(
        self,
        user_id,
        limit: int = 10,
    ):
        stmt = (
            select(Analytics)
            .where(Analytics.user_id == user_id)
            .order_by(
                Analytics.recorded_at.desc()
            )
            .limit(limit)
        )

        result = await self.session.execute(stmt)
        return result.scalars().all()

    # ==========================================================
    # Recent Connections
    # ==========================================================

    async def get_recent_connections(
        self,
        user_id,
        limit: int = 10,
    ):
        stmt = (
            select(SocialAccount)
            .where(
                SocialAccount.user_id == user_id
            )
            .order_by(
                SocialAccount.created_at.desc()
            )
            .limit(limit)
        )

        result = await self.session.execute(stmt)
        return result.scalars().all()

    # ==========================================================
    # Monthly Comparison
    # ==========================================================

    async def get_monthly_comparison(
        self,
        user_id,
    ):
        stmt = (
            select(
                func.year(
                    Analytics.recorded_at
                ).label("year"),
                func.month(
                    Analytics.recorded_at
                ).label("month"),
                func.sum(
                    Analytics.followers
                ).label("followers"),
            )
            .where(
                Analytics.user_id == user_id
            )
            .group_by(
                func.year(
                    Analytics.recorded_at
                ),
                func.month(
                    Analytics.recorded_at
                ),
            )
            .order_by(
                func.year(
                    Analytics.recorded_at
                ),
                func.month(
                    Analytics.recorded_at
                ),
            )
        )

        result = await self.session.execute(stmt)
        return result.all()

    # ==========================================================
    # Weekly Comparison
    # ==========================================================

    async def get_weekly_comparison(
        self,
        user_id,
    ):
        stmt = (
            select(
                func.year(
                    Analytics.recorded_at
                ).label("year"),
                func.week(
                    Analytics.recorded_at
                ).label("week"),
                func.sum(
                    Analytics.followers
                ).label("followers"),
            )
            .where(
                Analytics.user_id == user_id
            )
            .group_by(
                func.year(
                    Analytics.recorded_at
                ),
                func.week(
                    Analytics.recorded_at
                ),
            )
            .order_by(
                func.year(
                    Analytics.recorded_at
                ),
                func.week(
                    Analytics.recorded_at
                ),
            )
        )

        result = await self.session.execute(stmt)
        return result.all()