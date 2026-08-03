# app/api/routes/api_keys.py
"""Developer API Keys router."""

from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.api_key import APIKeyCreate, APIKeyResponse
from app.services.api_key_service import APIKeyService

router = APIRouter(prefix="/api-keys", tags=["Developer API Keys"])


@router.get(
    "",
    response_model=List[APIKeyResponse],
    status_code=status.HTTP_200_OK,
    summary="List developer API keys",
)
async def list_api_keys(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[APIKeyResponse]:
    service = APIKeyService(db)
    return await service.list_user_keys(current_user.id)


@router.post(
    "",
    response_model=APIKeyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate new API key",
)
async def generate_api_key(
    payload: APIKeyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> APIKeyResponse:
    service = APIKeyService(db)
    return await service.generate_api_key(current_user.id, payload)


@router.delete(
    "/{key_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Revoke API key",
)
async def revoke_api_key(
    key_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = APIKeyService(db)
    await service.revoke_key(key_id, current_user.id)
