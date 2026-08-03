# app/api/routes/settings.py
"""System & Workspace Settings router."""

from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.setting import SettingResponse, SettingUpdate
from app.services.setting_service import SettingService

router = APIRouter(prefix="/settings", tags=["System & Workspace Settings"])


@router.get(
    "",
    response_model=List[SettingResponse],
    status_code=status.HTTP_200_OK,
    summary="Get user/workspace settings",
)
async def get_settings(
    category: str = Query("general", description="general, brand, email, notifications, workspace"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[SettingResponse]:
    service = SettingService(db)
    return await service.get_settings(current_user.id, category=category)


@router.patch(
    "",
    response_model=List[SettingResponse],
    status_code=status.HTTP_200_OK,
    summary="Update settings",
)
async def update_settings(
    payload: SettingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[SettingResponse]:
    service = SettingService(db)
    return await service.update_settings(current_user.id, payload)
