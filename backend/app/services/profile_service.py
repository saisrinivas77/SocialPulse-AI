# app/services/profile_service.py
"""Profile service handling profile CRUD, avatar image cropping/compression to 512x512, and storage."""

import os
import uuid
import logging
from io import BytesIO
from typing import Dict, Any, Optional
from PIL import Image
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.user_profile_repository import UserProfileRepository
from app.services.cache_service import cache_service

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
UPLOADS_DIR = os.path.join(os.getcwd(), "uploads", "avatars")


class ProfileService:
    """Business logic for user profiles and 512x512 avatar image processing."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = UserProfileRepository(session)
        os.makedirs(UPLOADS_DIR, exist_ok=True)

    async def get_profile(self, user: User) -> Dict[str, Any]:
        """Fetch or auto-create profile for user."""
        profile = await self.repo.get_or_create(user)
        return {
            "id": profile.id,
            "user_id": profile.user_id,
            "display_name": profile.display_name or user.full_name,
            "username": profile.username or user.username,
            "email": profile.email or user.email,
            "profile_image": profile.profile_image or user.profile_image,
            "bio": profile.bio,
            "job_title": profile.job_title,
            "company": profile.company,
            "location": profile.location,
            "website": profile.website,
            "phone": profile.phone,
            "timezone": profile.timezone,
            "language": profile.language,
            "theme": profile.theme,
            "avatar_color": profile.avatar_color,
            "created_at": profile.created_at.isoformat() if profile.created_at else None,
            "updated_at": profile.updated_at.isoformat() if profile.updated_at else None,
        }

    async def update_profile(self, user: User, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile fields and invalidate cache."""
        profile = await self.repo.update_profile(user.id, update_data)
        await cache_service.invalidate_user(user.id)
        return await self.get_profile(user)

    async def upload_avatar(self, user: User, file: UploadFile) -> Dict[str, Any]:
        """Validate, crop to 512x512, compress, and save avatar image."""
        filename = file.filename or "avatar.png"
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file format '{ext}'. Allowed formats: PNG, JPEG, JPG, WEBP.",
            )

        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds maximum 5MB limit.",
            )

        try:
            # Crop & Resize Image to 512x512 using PIL
            image = Image.open(BytesIO(content))
            image = image.convert("RGB")
            
            # Center Crop to Square
            width, height = image.size
            min_dim = min(width, height)
            left = (width - min_dim) / 2
            top = (height - min_dim) / 2
            right = (width + min_dim) / 2
            bottom = (height + min_dim) / 2
            
            image_cropped = image.crop((left, top, right, bottom))
            image_resized = image_cropped.resize((512, 512), Image.Resampling.LANCZOS)
            
            # Save compressed WebP image
            unique_filename = f"avatar_{user.id}_{uuid.uuid4().hex[:8]}.webp"
            file_path = os.path.join(UPLOADS_DIR, unique_filename)
            image_resized.save(file_path, "WEBP", quality=90, optimize=True)
            
            avatar_url = f"/uploads/avatars/{unique_filename}"
            await self.repo.update_avatar(user.id, avatar_url)
            await cache_service.invalidate_user(user.id)
            
            return {
                "message": "Avatar uploaded and cropped to 512x512 successfully.",
                "avatar_url": avatar_url,
            }
        except Exception as exc:
            logger.error(f"Avatar processing error for user_id={user.id}: {exc}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing image file: {str(exc)}",
            )

    async def delete_avatar(self, user: User) -> Dict[str, Any]:
        """Restore default avatar."""
        full_name = user.full_name or user.username or "User"
        default_avatar = f"https://ui-avatars.com/api/?name={full_name}&background=0866FF&color=fff"
        await self.repo.delete_avatar(user.id, default_avatar)
        await cache_service.invalidate_user(user.id)
        return {
            "message": "Custom avatar removed. Restored default profile picture.",
            "avatar_url": default_avatar,
        }
