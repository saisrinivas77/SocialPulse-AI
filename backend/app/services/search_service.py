# app/services/search_service.py
"""Global Search Service."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.repositories.post_repository import PostRepository
from app.repositories.social_account_repository import SocialAccountRepository
from app.repositories.media_repository import MediaRepository
from app.schemas.search import GlobalSearchResult
from app.schemas.user import UserResponse
from app.schemas.post import PostResponse
from app.schemas.social_account import SocialAccountResponse
from app.schemas.media import MediaAssetResponse


class SearchService:
    def __init__(self, session: AsyncSession):
        self.user_repo = UserRepository(session)
        self.post_repo = PostRepository(session)
        self.social_repo = SocialAccountRepository(session)
        self.media_repo = MediaRepository(session)

    async def search_all(self, query: str, workspace_id: int | None = None) -> GlobalSearchResult:
        users = await self.user_repo.search_users(query, limit=5)

        user_responses = [UserResponse.model_validate(u) for u in users]

        return GlobalSearchResult(
            query=query,
            users=user_responses,
            posts=[],
            social_accounts=[],
            media_assets=[],
        )
