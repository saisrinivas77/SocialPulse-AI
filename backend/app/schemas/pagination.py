# app/schemas/pagination.py
"""Pagination envelope schemas."""

import math
from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Query parameters for pagination, sorting, and searching."""

    page: int = Field(default=1, ge=1, description="Page number.")
    page_size: int = Field(default=20, ge=1, le=100, description="Items limit per page.")
    search: str | None = Field(default=None, description="Search term.")
    sort_by: str | None = Field(default="created_at", description="Sort target column.")
    sort_order: str | None = Field(
        default="desc", pattern="^(asc|desc)$", description="Sort order direction."
    )


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic multi-item response envelope."""

    items: List[T]
    page: int
    page_size: int
    total: int
    pages: int

    @classmethod
    def create(
        cls, items: List[T], total: int, page: int, page_size: int
    ) -> "PaginatedResponse[T]":
        """Factory method computing page count."""
        pages = math.ceil(total / page_size) if page_size > 0 else 0
        return cls(
            items=items,
            page=page,
            page_size=page_size,
            total=total,
            pages=pages,
        )