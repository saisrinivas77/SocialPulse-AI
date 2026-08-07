# app/repositories/user_repository.py

from __future__ import annotations

from typing import Any, Sequence

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    """
    Repository responsible only for database operations.

    No business logic should exist in this layer.
    """

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(User, session)
        self.session = session

    async def get_by_id(self, user_id: Any) -> User | None:
        stmt = (
            select(User)
            .where(User.id == user_id)
        )

        result = await self.session.execute(stmt)

        return result.scalar_one_or_none()

    async def get_first_user(self) -> User | None:
        stmt = select(User).order_by(User.id.asc()).limit(1)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        stmt = (
            select(User)
            .where(User.email == email.lower().strip())
        )

        result = await self.session.execute(stmt)

        return result.scalar_one_or_none()

    async def get_by_username(self, username: str) -> User | None:
        stmt = (
            select(User)
            .where(User.username == username.lower().strip())
        )

        result = await self.session.execute(stmt)

        return result.scalar_one_or_none()

    async def get_by_verification_token(self, token: str) -> User | None:
        stmt = select(User).where(User.verification_token == token)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_reset_password_token(self, token: str) -> User | None:
        stmt = select(User).where(User.reset_password_token == token)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_provider_user_id(self, provider: str, provider_user_id: str) -> User | None:
        try:
            stmt = select(User).where(User.provider == provider, User.provider_user_id == provider_user_id)
            result = await self.session.execute(stmt)
            return result.scalar_one_or_none()
        except Exception:
            return None

    async def exists_by_email(self, email: str) -> bool:
        stmt = (
            select(User.id)
            .where(User.email == email.lower().strip())
        )

        result = await self.session.execute(stmt)

        return result.scalar_one_or_none() is not None

    async def exists_by_username(self, username: str) -> bool:
        stmt = (
            select(User.id)
            .where(User.username == username.lower().strip())
        )

        result = await self.session.execute(stmt)

        return result.scalar_one_or_none() is not None

    async def update_profile(
        self,
        user: User,
        update_data: dict,
    ) -> User:
        """
        Update only supplied profile fields.
        """

        for field, value in update_data.items():
            if hasattr(user, field):
                setattr(user, field, value)

        await self.session.flush()

        return user

    async def update_password(
        self,
        user: User,
        hashed_password: str,
    ) -> User:
        user.hashed_password = hashed_password

        await self.session.flush()

        return user

    async def activate(
        self,
        user: User,
    ) -> User:
        user.is_active = True
        await self.session.flush()

        return user

    async def deactivate(
        self,
        user: User,
    ) -> User:
        user.is_active = False
        await self.session.flush()

        return user

    async def verify_user(
        self,
        user: User,
    ) -> User:
        user.is_verified = True

        await self.session.flush()

        return user

    async def list_users(
        self,
        *,
        skip: int = 0,
        limit: int = 20,
    ) -> Sequence[User]:
        stmt = (
            select(User)
            .offset(skip)
            .limit(limit)
            .order_by(User.created_at.desc())
        )

        result = await self.session.execute(stmt)

        return result.scalars().all()

    async def search_users(
        self,
        keyword: str,
        *,
        skip: int = 0,
        limit: int = 20,
    ) -> Sequence[User]:
        keyword = f"%{keyword}%"

        stmt = (
            select(User)
            .where(
                (User.first_name.ilike(keyword))
                | (User.last_name.ilike(keyword))
                | (User.username.ilike(keyword))
                | (User.email.ilike(keyword))
            )
            .offset(skip)
            .limit(limit)
        )

        result = await self.session.execute(stmt)

        return result.scalars().all()

    async def count_users(self) -> int:
        stmt = select(func.count(User.id))

        result = await self.session.execute(stmt)

        return result.scalar_one()

    async def delete_user(
        self,
        user: User,
    ) -> None:
        await self.session.delete(user)

    async def save(self) -> None:
        await self.session.commit()

    async def refresh(
        self,
        user: User,
    ) -> None:
        await self.session.refresh(user)