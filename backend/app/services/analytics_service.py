from __future__ import annotations

from datetime import datetime

import logging
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import Analytics
from app.repositories.analytics_repository import AnalyticsRepository
from app.repositories.social_account_repository import SocialAccountRepository
from app.schemas.analytics import (
    AnalyticsCreate,
    AnalyticsResponse,
    AnalyticsUpdate,
)
from app.exceptions.exceptions import (
    NotFoundException,
)

logger = logging.getLogger(__name__)


class AnalyticsService:
    """
    Business logic for Analytics.
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        self.analytics_repository = AnalyticsRepository(session)
        self.social_repository = SocialAccountRepository(session)

    # ==========================================================
    # Calculations
    # ==========================================================

    @staticmethod
    def calculate_engagement_rate(
        likes: int,
        comments: int,
        shares: int,
        impressions: int,
    ) -> float:

        if impressions == 0:
            return 0.0

        return round(
            ((likes + comments + shares) / impressions) * 100,
            2,
        )

    @staticmethod
    def calculate_growth_rate(
        current_followers: int,
        previous_followers: int,
    ) -> float:

        if previous_followers == 0:
            return 0.0

        return round(
            (
                (current_followers - previous_followers)
                / previous_followers
            )
            * 100,
            2,
        )

    # ==========================================================
    # Create
    # ==========================================================

    async def create_analytics(
        self,
        current_user,
        request: AnalyticsCreate,
    ) -> AnalyticsResponse:

        social_account = await self.social_repository.get_by_id(
            request.social_account_id
        )

        if (
            social_account is None
            or social_account.user_id != current_user.id
        ):
            raise NotFoundException(
                "Social account not found."
            )

        previous = (
            await self.analytics_repository.get_latest_by_social_account(
                request.social_account_id
            )
        )

        previous_followers = (
            previous.followers
            if previous
            else 0
        )

        analytics = await self.analytics_repository.create_analytics(
            user_id=current_user.id,
            social_account_id=request.social_account_id,
            platform=request.platform,
            followers=request.followers,
            following=request.following,
            posts=request.posts,
            likes=request.likes,
            comments=request.comments,
            shares=request.shares,
            views=request.views,
            reach=request.reach,
            impressions=request.impressions,
            profile_visits=request.profile_visits,
            website_clicks=request.website_clicks,
            engagement_rate=self.calculate_engagement_rate(
                request.likes,
                request.comments,
                request.shares,
                request.impressions,
            ),
            growth_rate=self.calculate_growth_rate(
                request.followers,
                previous_followers,
            ),
            recorded_at=request.recorded_at
            or datetime.utcnow(),
        )

        logger.info(
            f"analytics_created analytics_id={analytics.id} user_id={current_user.id}"
        )

        return AnalyticsResponse.model_validate(
            analytics
        )

    # ==========================================================
    # List
    # ==========================================================

    async def list_analytics(
        self,
        current_user,
        page: int = 1,
        page_size: int = 20,
        platform: str | None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
    ):

        items, total = (
            await self.analytics_repository.list_user_analytics(
                user_id=current_user.id,
                page=page,
                page_size=page_size,
                platform=platform,
                start_date=start_date,
                end_date=end_date,
            )
        )

        return {
            "items": [
                AnalyticsResponse.model_validate(i)
                for i in items
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    # ==========================================================
    # Get One
    # ==========================================================

    async def get_analytics(
        self,
        analytics_id: int,
        current_user,
    ) -> AnalyticsResponse:

        analytics = (
            await self.analytics_repository.get_by_user_and_id(
                current_user.id,
                analytics_id,
            )
        )

        if analytics is None:
            raise NotFoundException(
                "Analytics not found."
            )

        return AnalyticsResponse.model_validate(
            analytics
        )

    # ==========================================================
    # Update
    # ==========================================================

    async def update_analytics(
        self,
        analytics_id: int,
        current_user,
        request: AnalyticsUpdate,
    ) -> AnalyticsResponse:

        analytics = (
            await self.analytics_repository.get_by_user_and_id(
                current_user.id,
                analytics_id,
            )
        )

        if analytics is None:
            raise NotFoundException(
                "Analytics not found."
            )

        data = request.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        for key, value in data.items():
            setattr(analytics, key, value)

        data["engagement_rate"] = (
            self.calculate_engagement_rate(
                analytics.likes,
                analytics.comments,
                analytics.shares,
                analytics.impressions,
            )
        )

        await self.analytics_repository.update_analytics(
            analytics,
            **data,
        )

        logger.info(
            f"analytics_updated analytics_id={analytics.id}"
        )

        return AnalyticsResponse.model_validate(
            analytics
        )

    # ==========================================================
    # Delete
    # ==========================================================

    async def delete_analytics(
        self,
        analytics_id: int,
        current_user,
    ):

        analytics = (
            await self.analytics_repository.get_by_user_and_id(
                current_user.id,
                analytics_id,
            )
        )

        if analytics is None:
            raise NotFoundException(
                "Analytics not found."
            )

        await self.analytics_repository.delete_analytics(
            analytics
        )

        logger.info(
            f"analytics_deleted analytics_id={analytics.id}"
        )

        return {
            "message": "Analytics deleted successfully."
        }

    # ==========================================================
    # Dashboard Summary
    # ==========================================================

    async def dashboard_summary(
        self,
        current_user,
    ):
        return await self.analytics_repository.dashboard_summary(
            current_user.id
        )

    # ==========================================================
    # Platform Summary
    # ==========================================================

    async def platform_summary(
        self,
        current_user,
    ):
        return await self.analytics_repository.platform_summary(
            current_user.id
        )