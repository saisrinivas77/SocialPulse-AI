# app/repositories/user_profile_repository.py
"""Repository handling UserProfile persistence and default profile provisioning."""

import urllib.parse
from typing import Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.user_profile import UserProfile


class UserProfileRepository:
    """Async database repository for user_profiles table."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_user_id(self, user_id: int) -> Optional[UserProfile]:
        """Fetch profile row for given user ID."""
        stmt = select(UserProfile).where(UserProfile.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_or_create(self, user: User) -> UserProfile:
        """Fetch profile or auto-provision a default profile for the user."""
        profile = await self.get_by_user_id(user.id)
        if profile:
            return profile

        # Generate default initial-based avatar if no avatar URL exists
        full_name = user.full_name or user.username or "User"
        initials = "".join([part[0].upper() for part in full_name.strip().split() if part])[:2] or "SP"
        default_avatar = user.profile_image or user.avatar_url or f"https://ui-avatars.com/api/?name={urllib.parse.quote(full_name)}&background=0866FF&color=fff"

        new_profile = UserProfile(
            user_id=user.id,
            display_name=full_name,
            username=user.username,
            email=user.email,
            profile_image=default_avatar,
            bio="Senior Social Growth Strategist & Content Creator.",
            job_title="Marketing Lead",
            company="SocialPulse Enterprise",
            location="San Francisco, CA",
            website="https://socialpulse.ai",
            timezone="UTC",
            language="en",
            theme="dark",
            avatar_color="#0866FF",
        )
        self.session.add(new_profile)
        await self.session.commit()
        await self.session.refresh(new_profile)
        return new_profile

    async def update_profile(self, user_id: int, update_data: Dict[str, Any]) -> UserProfile:
        """Update fields in UserProfile."""
        stmt = select(UserProfile).where(UserProfile.user_id == user_id)
        res = await self.session.execute(stmt)
        profile = res.scalar_one_or_none()
        
        if not profile:
            user_stmt = select(User).where(User.id == user_id)
            user_res = await self.session.execute(user_stmt)
            user = user_res.scalar_one()
            profile = await self.get_or_create(user)

        for key, val in update_data.items():
            if hasattr(profile, key) and val is not None:
                setattr(profile, key, val)

        await self.session.commit()
        await self.session.refresh(profile)
        return profile

    async def update_avatar(self, user_id: int, avatar_url: str) -> UserProfile:
        """Update avatar image URL in UserProfile & User tables."""
        profile = await self.update_profile(user_id, {"profile_image": avatar_url})
        
        # Also update User table profile_image
        user_stmt = select(User).where(User.id == user_id)
        user_res = await self.session.execute(user_stmt)
        user = user_res.scalar_one_or_none()
        if user:
            user.profile_image = avatar_url
            await self.session.commit()
            
        return profile

    async def delete_avatar(self, user_id: int, default_avatar: str) -> UserProfile:
        """Restore default avatar URL."""
        return await self.update_avatar(user_id, default_avatar)
