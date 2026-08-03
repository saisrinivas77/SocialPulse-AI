"""
Generic Base Repository.

Provides reusable CRUD operations for SQLAlchemy models.

Features
--------
✔ CRUD
✔ Pagination
✔ Search
✔ Filtering
✔ Sorting
✔ Type Safe
✔ Production Ready

Every repository should inherit from this class.
"""

from __future__ import annotations

from typing import Any, Generic, Optional, Sequence, Type, TypeVar

from sqlalchemy import asc, desc
from sqlalchemy.orm import Query, Session

from app.utils.pagination import paginate

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    """
    Generic repository implementing common CRUD operations.
    """

    def __init__(
        self,
        db: Session,
        model: Type[ModelType],
    ) -> None:
        self.db = db
        self.model = model

    # --------------------------------------------------
    # Query
    # --------------------------------------------------

    def query(self) -> Query:
        """
        Return base query.
        """
        return self.db.query(self.model)

    # --------------------------------------------------
    # Get
    # --------------------------------------------------

    def get(
        self,
        obj_id: Any,
    ) -> Optional[ModelType]:
        """
        Get single object by primary key.
        """
        return (
            self.query()
            .filter(self.model.id == obj_id)
            .first()
        )

    def get_all(
        self,
    ) -> Sequence[ModelType]:
        """
        Return all records.
        """
        return self.query().all()

    # --------------------------------------------------
    # Create
    # --------------------------------------------------

    def create(
        self,
        **kwargs: Any,
    ) -> ModelType:
        """
        Create new record.
        """
        obj = self.model(**kwargs)

        self.db.add(obj)

        self.db.commit()

        self.db.refresh(obj)

        return obj

    # --------------------------------------------------
    # Update
    # --------------------------------------------------

    def update(
        self,
        obj: ModelType,
        **kwargs: Any,
    ) -> ModelType:
        """
        Update record.
        """
        for key, value in kwargs.items():

            if hasattr(obj, key):

                setattr(obj, key, value)

        self.db.commit()

        self.db.refresh(obj)

        return obj

    # --------------------------------------------------
    # Delete
    # --------------------------------------------------

    def delete(
        self,
        obj: ModelType,
    ) -> None:
        """
        Delete record.
        """
        self.db.delete(obj)

        self.db.commit()

    # --------------------------------------------------
    # Pagination
    # --------------------------------------------------

    def paginate_query(
    self,
    query: Query,
    page: int = 1,
    page_size: int = 20,
    ):
       return paginate(
        query=query,
        page=page,
        page_size=page_size,
    )

    # --------------------------------------------------
    # Search
    # --------------------------------------------------
    
    def search(
        self,
        search: str,
        *columns,
    ) -> Query:
        """
        Search across multiple columns.
        """
        query = self.query()

        if not search:

            return query

        filters = [
            column.ilike(f"%{search}%")
            for column in columns
        ]

        return query.filter(
            filters.pop()
            if len(filters) == 1
            else filters[0] | filters[1]
            if len(filters) == 2
            else __import__("sqlalchemy").or_(*filters)
        )

    # --------------------------------------------------
    # Sorting
    # --------------------------------------------------

    def sort(
        self,
        query: Query,
        sort_by: str,
        order: str = "asc",
    ) -> Query:
        """
        Sort query.
        """

        if not hasattr(self.model, sort_by):

            return query

        column = getattr(
            self.model,
            sort_by,
        )

        if order.lower() == "desc":

            return query.order_by(desc(column))

        return query.order_by(asc(column))

    # --------------------------------------------------
    # Filtering
    # --------------------------------------------------

    def filter(
        self,
        query: Query,
        **filters,
    ) -> Query:
        """
        Apply equality filters dynamically.
        """

        for key, value in filters.items():

            if value is None:

                continue

            if hasattr(self.model, key):

                query = query.filter(
                    getattr(self.model, key) == value
                )

        return query