"""
Generic SQLAlchemy 2.0 Async Query Builder.

Production-ready query builder supporting:

✔ Search
✔ Filtering
✔ Sorting
✔ Soft delete
✔ Range filters

Designed for FastAPI + async SQLAlchemy 2.0 Select statements.
"""

from __future__ import annotations

from typing import Any, Dict, Generic, List, Optional, TypeVar

from sqlalchemy import Select, asc, desc, or_, select
from sqlalchemy.orm import InstrumentedAttribute

from app.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class QueryBuilder(Generic[ModelType]):
    """
    Generic async SQLAlchemy 2.0 Query Builder.

    Works with Select statements (not legacy Query objects).
    Supports method chaining.
    """

    MAX_PAGE_SIZE = 100
    DEFAULT_PAGE_SIZE = 20

    def __init__(self, model: type[ModelType]):
        self.model = model
        self.stmt: Select = select(model)

    # -------------------------------------------------------
    # Filter by Owner
    # -------------------------------------------------------

    def filter_by_owner(
        self,
        field_name: str,
        value: Any,
    ) -> "QueryBuilder[ModelType]":
        """
        Filter by a specific ownership field (e.g. workspace_id, user_id).
        """
        column = getattr(self.model, field_name, None)
        if column is not None:
            self.stmt = self.stmt.where(column == value)
        return self

    # -------------------------------------------------------
    # Exact Filters
    # -------------------------------------------------------

    def filter_exact(
        self,
        filters: Dict[Any, Any],
    ) -> "QueryBuilder[ModelType]":
        """
        Apply equality filters using column-value pairs.

        Example:
            builder.filter_exact({Post.status: "DRAFT", Post.workspace_id: 1})
        """
        for column, value in filters.items():
            if value is not None:
                self.stmt = self.stmt.where(column == value)
        return self

    # -------------------------------------------------------
    # Range Filters
    # -------------------------------------------------------

    def filter_range(
        self,
        column: Any,
        min_val: Any = None,
        max_val: Any = None,
    ) -> "QueryBuilder[ModelType]":
        """
        Numeric/date range filtering.
        """
        if min_val is not None:
            self.stmt = self.stmt.where(column >= min_val)
        if max_val is not None:
            self.stmt = self.stmt.where(column <= max_val)
        return self

    # -------------------------------------------------------
    # Soft Delete Filter
    # -------------------------------------------------------

    def apply_soft_delete_filter(
        self,
        include_deleted: bool = False,
    ) -> "QueryBuilder[ModelType]":
        """
        Exclude soft-deleted records when is_deleted column exists.
        """
        if not include_deleted and hasattr(self.model, "is_deleted"):
            col = getattr(self.model, "is_deleted")
            self.stmt = self.stmt.where(col.is_(False))
        return self

    # -------------------------------------------------------
    # Search
    # -------------------------------------------------------

    def search(
        self,
        keyword: Optional[str],
        search_fields: Optional[List[str]] = None,
    ) -> "QueryBuilder[ModelType]":
        """
        Perform case-insensitive search across multiple columns.

        Example:
            builder.search("python", search_fields=["title", "content"])
        """
        if not keyword or not search_fields:
            return self

        keyword = keyword.strip()
        if not keyword:
            return self

        conditions = []
        for field_name in search_fields:
            column = getattr(self.model, field_name, None)
            if column is not None:
                conditions.append(column.ilike(f"%{keyword}%"))

        if conditions:
            self.stmt = self.stmt.where(or_(*conditions))

        return self

    # -------------------------------------------------------
    # Sorting
    # -------------------------------------------------------

    def sort(
        self,
        field: Optional[str],
        order: Optional[str] = "desc",
    ) -> "QueryBuilder[ModelType]":
        """
        Dynamic sorting by field name and order.
        """
        if not field:
            return self

        column = getattr(self.model, field, None)
        if column is None:
            return self

        if order and order.lower() == "asc":
            self.stmt = self.stmt.order_by(asc(column))
        else:
            self.stmt = self.stmt.order_by(desc(column))

        return self

    # -------------------------------------------------------
    # Final Query
    # -------------------------------------------------------

    def build(self) -> Select:
        """
        Return the built SQLAlchemy Select statement.
        """
        return self.stmt