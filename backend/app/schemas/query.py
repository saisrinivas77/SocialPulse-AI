"""
Reusable query parameter schemas.

These schemas provide a consistent interface for pagination,
searching, filtering, and sorting across all endpoints.

Example:
---------
GET /posts?page=1&page_size=20&search=python&sort_by=created_at&order=desc
"""

from __future__ import annotations

from enum import Enum
from typing import Annotated

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field


# ==========================================================
# Sort Order
# ==========================================================


class SortOrder(str, Enum):
    """
    Sorting direction.
    """

    ASC = "asc"
    DESC = "desc"


# ==========================================================
# Base Query
# ==========================================================


class BaseQueryParams(BaseModel):
    """
    Base query parameters shared by all endpoints.
    """

    model_config = ConfigDict(
        extra="forbid",
        frozen=True,
    )

    page: int = Field(
        default=1,
        ge=1,
        description="Page number",
    )

    page_size: int = Field(
        default=20,
        ge=1,
        le=100,
        description="Records per page",
    )

    search: str | None = Field(
        default=None,
        max_length=200,
        description="Search keyword",
    )

    sort_by: str | None = Field(
        default=None,
        max_length=50,
        description="Field used for sorting",
    )

    order: SortOrder = Field(
        default=SortOrder.DESC,
        description="Sorting order",
    )


# ==========================================================
# Post Query
# ==========================================================


class PostQueryParams(BaseQueryParams):
    """
    Query parameters for Posts.
    """

    status: str | None = Field(
        default=None,
        description="Draft / Scheduled / Published",
    )

    social_account_id: int | None = Field(
        default=None,
        ge=1,
    )


# ==========================================================
# Analytics Query
# ==========================================================


class AnalyticsQueryParams(BaseQueryParams):
    """
    Analytics query parameters.
    """

    platform: str | None = None

    followers_min: int | None = Field(
        default=None,
        ge=0,
    )

    followers_max: int | None = Field(
        default=None,
        ge=0,
    )

    reach_min: int | None = Field(
        default=None,
        ge=0,
    )

    reach_max: int | None = Field(
        default=None,
        ge=0,
    )


# ==========================================================
# Social Account Query
# ==========================================================


class SocialAccountQueryParams(BaseQueryParams):
    """
    Social Account query parameters.
    """

    platform: str | None = None


# ==========================================================
# FastAPI Dependencies
# ==========================================================


PostQuery = Annotated[PostQueryParams, Query()]
AnalyticsQuery = Annotated[AnalyticsQueryParams, Query()]
SocialAccountQuery = Annotated[SocialAccountQueryParams, Query()]