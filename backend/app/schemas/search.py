# app/schemas/search.py
"""Pydantic schemas for Global Search."""

from typing import List, Optional
from pydantic import BaseModel
from app.schemas.post import PostResponse
from app.schemas.social_account import SocialAccountResponse
from app.schemas.media import MediaAssetResponse
from app.schemas.user import UserResponse


class GlobalSearchResult(BaseModel):
    """Unified search results grouped by resource type."""

    query: str
    users: List[UserResponse] = []
    posts: List[PostResponse] = []
    social_accounts: List[SocialAccountResponse] = []
    media_assets: List[MediaAssetResponse] = []
