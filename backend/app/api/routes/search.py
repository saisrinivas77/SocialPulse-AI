# app/api/routes/search.py
"""Unified Global Search router."""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.search import GlobalSearchResult
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["Global Search"])


@router.get(
    "",
    response_model=GlobalSearchResult,
    status_code=status.HTTP_200_OK,
    summary="Global cross-entity search",
)
async def global_search(
    q: str = Query(..., min_length=1, description="Search query across users, posts, accounts, media"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GlobalSearchResult:
    service = SearchService(db)
    return await service.search_all(query=q)
