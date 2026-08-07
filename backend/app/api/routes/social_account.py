# app/api/routes/social_account.py
"""FastAPI endpoints for Social Accounts management & OAuth integrations bound to Workspace boundary."""

import os
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status, HTTPException
from fastapi.responses import RedirectResponse

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


@router.post(
    "/connect/{provider}",
    response_model=SocialAccountResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Connect social account to workspace",
)
async def connect_account_by_provider(
    provider: str,
    payload: SocialAccountCreate,
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    service: SocialAccountService = Depends(get_social_account_service),
) -> SocialAccountResponse:
    return await service.connect_account(
        workspace_id=workspace_id, user_id=current_user.id, data=payload
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
    "/oauth/{provider}/authorize_url",
    status_code=status.HTTP_200_OK,
    summary="Get OAuth Authorization URL for authenticated user",
)
async def get_oauth_authorize_url(
    provider: str,
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    service: SocialAccountService = Depends(get_social_account_service),
):
    """Generate signed OAuth authorization URL containing active user and workspace context."""
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    lookup_key = "meta" if provider.lower() in ["instagram", "facebook", "meta", "threads"] else provider.lower()
    redirect_uri = f"{backend_url}/api/v1/social-accounts/oauth/{lookup_key}/callback"
    auth_url = await service.get_oauth_login_url(provider, workspace_id, redirect_uri, user_id=current_user.id)
    return {
        "provider": provider,
        "authorization_url": auth_url,
        "workspace_id": workspace_id,
        "user_id": current_user.id,
    }


@router.get(
    "/oauth/{provider}/login",
    summary="Initiate Provider OAuth flow",
)
async def oauth_login(
    provider: str,
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    service: SocialAccountService = Depends(get_social_account_service),
):
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    lookup_key = "meta" if provider.lower() in ["instagram", "facebook", "meta", "threads"] else provider.lower()
    redirect_uri = f"{backend_url}/api/v1/social-accounts/oauth/{lookup_key}/callback"
    auth_url = await service.get_oauth_login_url(provider, workspace_id, redirect_uri, user_id=current_user.id)
    return RedirectResponse(url=auth_url)


@router.post(
    "/oauth/meta",
    status_code=status.HTTP_200_OK,
    summary="Meta OAuth handshake POST",
)
async def oauth_meta_post(payload: Optional[dict] = None):
    return {"status": "connected", "platform": "Meta"}


@router.post(
    "/oauth/linkedin",
    status_code=status.HTTP_200_OK,
    summary="LinkedIn OAuth handshake POST",
)
async def oauth_linkedin_post(payload: Optional[dict] = None):
    return {"status": "connected", "platform": "LinkedIn"}


@router.post(
    "/oauth/x",
    status_code=status.HTTP_200_OK,
    summary="X (Twitter) OAuth handshake POST",
)
async def oauth_x_post(payload: Optional[dict] = None):
    return {"status": "connected", "platform": "X"}


@router.post(
    "/oauth/{provider}",
    status_code=status.HTTP_200_OK,
    summary="Generic Provider OAuth handshake POST",
)
async def oauth_generic_post(provider: str, payload: Optional[dict] = None):
    return {"status": "connected", "platform": provider}


@router.get(
    "/oauth/{provider}/callback",
    summary="Provider OAuth Callback endpoint",
)
async def oauth_callback(
    provider: str,
    code: Optional[str] = Query(default=None),
    state: Optional[str] = Query(default=None),
    error: Optional[str] = Query(default=None),
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    service: SocialAccountService = Depends(get_social_account_service),
):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    if error or not code:
        return RedirectResponse(url=f"{frontend_url}/dashboard?tab=social-accounts&error={error or 'no_code'}")

    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    redirect_uri = f"{backend_url}/api/v1/social-accounts/oauth/{provider}/callback"
    try:
        await service.handle_oauth_callback(
            provider=provider,
            code=code,
            redirect_uri=redirect_uri,
            user_id=current_user.id,
            workspace_id=workspace_id,
            user_email=current_user.email,
        )
        return RedirectResponse(url=f"{frontend_url}/dashboard?tab=social-accounts&connected=true&provider={provider}")
    except Exception as exc:
        return RedirectResponse(url=f"{frontend_url}/dashboard?tab=social-accounts&error={str(exc)}")


@router.post(
    "/{account_id}/sync",
    response_model=SocialAccountResponse,
    status_code=status.HTTP_200_OK,
    summary="Sync connected account telemetry with platform API",
)
async def sync_account_data(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    service: SocialAccountService = Depends(get_social_account_service),
) -> SocialAccountResponse:
    return await service.sync_account_metrics(
        account_id=account_id, workspace_id=workspace_id, user_email=current_user.email
    )


@router.delete(
    "/{account_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Disconnect account and clear tokens",
)
async def disconnect_account(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
) -> Response:
    await service.disconnect_account(workspace_id=workspace_id, account_id=account_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{account_id}/analytics",
    status_code=status.HTTP_200_OK,
    summary="Get channel analytics & raw telemetry",
)
async def get_account_analytics(
    account_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    service: SocialAccountService = Depends(get_social_account_service),
):
    return await service.get_account_analytics(account_id=account_id, workspace_id=workspace_id)


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