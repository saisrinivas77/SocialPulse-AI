# app/services/user_service.py

from __future__ import annotations

import logging
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.security import (
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import (
    ChangePasswordRequest,
    UserResponse,
    UserUpdate,
)
from app.exceptions.exceptions import (
    ConflictException,
    NotFoundException,
    ValidationException,
)

logger = logging.getLogger(__name__)


class UserService:
    """
    User business logic layer.

    All validations belong here.
    """

    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.user_repository = UserRepository(session)

    async def get_my_profile(
        self,
        current_user: User,
    ) -> UserResponse:
        """
        Return authenticated user profile.
        """

        return UserResponse.model_validate(current_user)

    async def update_my_profile(
        self,
        current_user: User,
        data: UserUpdate,
    ) -> UserResponse:
        """
        Update authenticated user's profile.
        """

        update_data = data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        if not update_data:
            return UserResponse.model_validate(current_user)

        # ------------------------------------
        # Username Validation
        # ------------------------------------

        if "username" in update_data:

            existing = await self.user_repository.get_by_username(
                update_data["username"]
            )

            if (
                existing
                and existing.id != current_user.id
            ):
                raise ConflictException(
                    "Username already exists."
                )

        # ------------------------------------
        # Email Validation
        # ------------------------------------

        if "email" in update_data:

            existing = await self.user_repository.get_by_email(
                update_data["email"]
            )

            if (
                existing
                and existing.id != current_user.id
            ):
                raise ConflictException(
                    "Email already exists."
                )

        user = await self.user_repository.update_profile(
            current_user,
            update_data,
        )

        await self.user_repository.save()

        await self.user_repository.refresh(user)

        logger.info(
            f"profile_updated user_id={user.id}"
        )

        return UserResponse.model_validate(user)

    async def change_password(
        self,
        current_user: User,
        data: ChangePasswordRequest,
    ) -> dict:
        """
        Change authenticated user's password.
        """

        if not verify_password(
            data.current_password,
            current_user.hashed_password,
        ):
            raise ValidationException(
                "Current password is incorrect."
            )

        if verify_password(
            data.new_password,
            current_user.hashed_password,
        ):
            raise ValidationException(
                "New password must be different from current password."
            )

        hashed = hash_password(
            data.new_password
        )

        await self.user_repository.update_password(
            current_user,
            hashed,
        )

        await self.user_repository.save()

        logger.info(
            f"password_changed user_id={current_user.id}"
        )

        return {
            "message": "Password changed successfully."
        }

    async def get_user(
        self,
        user_id: int,
    ) -> User:
        """
        Fetch user by ID.
        """

        user = await self.user_repository.get_by_id(
            user_id
        )

        if not user:
            raise NotFoundException(
                "User not found."
            )

        return user

    async def deactivate_user(
        self,
        user_id: int,
    ) -> dict:

        user = await self.get_user(
            user_id
        )

        await self.user_repository.deactivate(
            user
        )

        await self.user_repository.save()

        logger.info(
            f"user_deactivated user_id={user.id}"
        )

        return {
            "message": "User deactivated successfully."
        }

    async def activate_user(
        self,
        user_id: int,
    ) -> dict:

        user = await self.get_user(
            user_id
        )

        await self.user_repository.activate(
            user
        )

        await self.user_repository.save()

        logger.info(
            f"user_activated user_id={user.id}"
        )

        return {
            "message": "User activated successfully."
        }

    async def verify_user(
        self,
        user_id: int,
    ) -> dict:

        user = await self.get_user(
            user_id
        )

        await self.user_repository.verify_user(
            user
        )

        await self.user_repository.save()

        logger.info(
            f"user_verified user_id={user.id}"
        )

        return {
            "message": "User verified successfully."
        }

    async def list_users(
        self,
        *,
        page: int = 1,
        page_size: int = 20,
    ):
        skip = (page - 1) * page_size

        users = await self.user_repository.list_users(
            skip=skip,
            limit=page_size,
        )

        total = await self.user_repository.count_users()

        return {
            "items": [
                UserResponse.model_validate(
                    user
                )
                for user in users
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    async def search_users(
        self,
        keyword: str,
        *,
        page: int = 1,
        page_size: int = 20,
    ):
        skip = (page - 1) * page_size

        users = await self.user_repository.search_users(
            keyword,
            skip=skip,
            limit=page_size,
        )

        total = len(users)

        return {
            "items": [
                UserResponse.model_validate(
                    user
                )
                for user in users
            ],
            "total": total,
            "page": page,
            "page_size": page_size,
        }