# app/api/routes/profile.py
"""FastAPI Profile router handling profile CRUD and 512x512 avatar uploads."""

from typing import Annotated
from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.profile_service import ProfileService

router = APIRouter(prefix="/profile", tags=["Profile Management"])

DBSession = Annotated[AsyncSession, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]


@router.get("", status_code=status.HTTP_200_OK, summary="Get User Profile")
async def get_profile(db: DBSession, current_user: CurrentUser):
    """Retrieve authenticated user's profile details or auto-provision default profile."""
    service = ProfileService(db)
    return await service.get_profile(current_user)


@router.put("", status_code=status.HTTP_200_OK, summary="Update User Profile")
async def update_profile(payload: dict, db: DBSession, current_user: CurrentUser):
    """Update profile attributes (display_name, bio, job_title, company, location, etc.)."""
    service = ProfileService(db)
    return await service.update_profile(current_user, payload)


@router.post("/avatar", status_code=status.HTTP_200_OK, summary="Upload & Crop Profile Avatar")
async def upload_avatar(
    db: DBSession,
    current_user: CurrentUser,
    file: UploadFile = File(..., description="Avatar image file (PNG, JPEG, JPG, WEBP max 5MB)"),
):
    """Upload, crop to 512x512, compress, and save custom avatar picture."""
    service = ProfileService(db)
    return await service.upload_avatar(current_user, file)


@router.delete("/avatar", status_code=status.HTTP_200_OK, summary="Remove Custom Avatar")
async def delete_avatar(db: DBSession, current_user: CurrentUser):
    """Remove custom profile picture and restore default OAuth / initials avatar."""
    service = ProfileService(db)
    return await service.delete_avatar(current_user)
