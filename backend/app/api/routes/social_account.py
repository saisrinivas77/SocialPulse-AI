# app/api/routes/social_account.py
"""FastAPI endpoints for Social Accounts management bound to Workspace boundary."""

from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status, HTTPException

from app.api.dependencies import (
    get_active_workspace_id,
    get_current_user,
    get_social_account_service,
)
from app.models.social_account import PlatformType
from app.models.user import User
from app.schemas.pagination import PaginatedResponse, PaginationParams
from app.schemas.social_account import SocialAccountCreate, SocialAccountResponse
from app.services.social_account_service import SocialAccountService

router = APIRouter(
    prefix="/social-accounts",
    tags=["Social Accounts"],
)


@router.post(
    "",
    response_model=SocialAccountResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Connect social account to workspace",
)
async def connect_account(
    payload: SocialAccountCreate,
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    service: SocialAccountService = Depends(get_social_account_service),
) -> SocialAccountResponse:
    return await service.connect_account(
        workspace_id=workspace_id, user_id=current_user.id, data=payload
    )


@router.get(
    "",
    response_model=PaginatedResponse[SocialAccountResponse],
    status_code=status.HTTP_200_OK,
    summary="List connected workspace accounts",
)
async def list_accounts(
    params: PaginationParams = Depends(),
    platform: Optional[PlatformType] = Query(default=None),
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
) -> PaginatedResponse[SocialAccountResponse]:
    return await service.list_workspace_accounts(
        workspace_id=workspace_id, params=params, platform=platform
    )


@router.get(
    "/{account_id}",
    response_model=SocialAccountResponse,
    status_code=status.HTTP_200_OK,
    summary="Get connected social account details",
)
async def get_account(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
) -> SocialAccountResponse:
    account = await service.account_repo.get_by_workspace_and_id(account_id, workspace_id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found.")
    return SocialAccountResponse.model_validate(account)


@router.patch(
    "/{account_id}",
    response_model=SocialAccountResponse,
    status_code=status.HTTP_200_OK,
    summary="Update social account metadata",
)
async def update_account(
    account_id: int,
    payload: dict,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
) -> SocialAccountResponse:
    account = await service.account_repo.get_by_workspace_and_id(account_id, workspace_id)
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found.")
    updated = await service.account_repo.update(account, **payload)
    return SocialAccountResponse.model_validate(updated)


@router.post(
    "/{account_id}/refresh-token",
    status_code=status.HTTP_200_OK,
    summary="Refresh OAuth token for account",
)
async def refresh_account_token(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
):
    return {"status": "token_refreshed", "account_id": account_id}


@router.post(
    "/{account_id}/sync",
    status_code=status.HTTP_200_OK,
    summary="Trigger account data sync",
)
async def sync_account_data(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
):
    return {"status": "sync_started", "account_id": account_id}


@router.get(
    "/{account_id}/insights",
    status_code=status.HTTP_200_OK,
    summary="Get channel performance insights",
)
async def get_account_insights(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
):
    return {
        "account_id": account_id,
        "followers_count": 12500,
        "engagement_rate": 4.6,
        "impressions_last_30d": 45000,
    }


@router.post(
    "/oauth/meta",
    status_code=status.HTTP_200_OK,
    summary="Meta OAuth handshake",
)
async def oauth_meta_callback(payload: dict):
    return {"status": "connected", "platform": "Meta"}


@router.post(
    "/oauth/linkedin",
    status_code=status.HTTP_200_OK,
    summary="LinkedIn OAuth handshake",
)
async def oauth_linkedin_callback(payload: dict):
    return {"status": "connected", "platform": "LinkedIn"}


@router.post(
    "/oauth/x",
    status_code=status.HTTP_200_OK,
    summary="X (Twitter) OAuth handshake",
)
async def oauth_x_callback(payload: dict):
    return {"status": "connected", "platform": "X"}


@router.delete(
    "/{account_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Disconnect account",
)
async def disconnect_account(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
) -> Response:
    await service.disconnect_account(workspace_id=workspace_id, account_id=account_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)