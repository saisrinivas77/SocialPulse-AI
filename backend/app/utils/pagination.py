"""
Reusable pagination utilities.

This module provides production-ready offset pagination
for SQLAlchemy async queries.
"""

from math import ceil
from typing import TypeVar

T = TypeVar("T")


def calculate_pages(total: int, page_size: int) -> int:
    """Calculate total number of pages."""
    if page_size <= 0:
        return 0
    return ceil(total / page_size) if total > 0 else 1


def calculate_offset(page: int, page_size: int) -> int:
    """Calculate query offset from page number."""
    page = max(page, 1)
    page_size = max(page_size, 1)
    return (page - 1) * page_size