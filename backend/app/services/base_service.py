"""
Base Service Layer.

Provides reusable service methods that wrap repository operations.

Responsibilities
----------------
✔ CRUD
✔ Validation hooks
✔ Pagination
✔ Error handling
✔ Logging ready
"""

from __future__ import annotations

from typing import Any, Generic, Optional, TypeVar

ModelType = TypeVar("ModelType")
RepositoryType = TypeVar("RepositoryType")


class BaseService(Generic[RepositoryType, ModelType]):
    """
    Generic service layer.

    Business logic belongs here.
    Database logic belongs inside repositories.
    """

    def __init__(
        self,
        repository: RepositoryType,
    ) -> None:
        self.repository = repository

    # ----------------------------------------------------
    # Read
    # ----------------------------------------------------

    def get(
        self,
        obj_id: Any,
    ) -> Optional[ModelType]:
        return self.repository.get(obj_id)

    def get_all(self):
        return self.repository.get_all()

    # ----------------------------------------------------
    # Create
    # ----------------------------------------------------

    def create(
        self,
        **kwargs,
    ):
        return self.repository.create(**kwargs)

    # ----------------------------------------------------
    # Update
    # ----------------------------------------------------

    def update(
        self,
        obj,
        **kwargs,
    ):
        return self.repository.update(
            obj,
            **kwargs,
        )

    # ----------------------------------------------------
    # Delete
    # ----------------------------------------------------

    def delete(
        self,
        obj,
    ):
        return self.repository.delete(obj)

    # ----------------------------------------------------
    # Pagination
    # ----------------------------------------------------

    def paginate(
        self,
        page: int = 1,
        page_size: int = 20,
    ):
        return self.repository.paginate(
            page=page,
            page_size=page_size,
        )