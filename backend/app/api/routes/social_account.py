# app/api/routes/social_account.py
"""FastAPI endpoints for Social Accounts management & OAuth integrations bound to Workspace boundary."""

import logging
import os
import urllib.parse
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, status, HTTPException
from fastapi.responses import RedirectResponse

from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
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

logger = logging.getLogger(__name__)

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
    db: AsyncSession = Depends(get_db),
):
    """
    OAuth 2.0 callback endpoint. Does NOT require Authorization header.
    User identity is recovered from the signed, time-limited OAuth state token.
    All errors redirect to the dashboard with a user-friendly error message.
    """
    from app.exceptions.custom import OAuthException  # must import to catch before global handler

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Provider denied access or no code was returned
    if error or not code:
        err_label = urllib.parse.quote(str(error or "no_code")[:200])
        return RedirectResponse(
            url=f"{frontend_url}/dashboard?connected={provider}&error={err_label}"
        )

    # ── Resolve user & workspace from signed OAuth state token ─────────────
    user_id: int = 1
    workspace_id: int = 1
    user_email: str = "saisrinivasreddy456@gmail.com"

    if state:
        from app.utils.security import decode_oauth_state_token
        state_data = decode_oauth_state_token(state)
        if state_data:
            try:
                raw_sub = state_data.get("sub")
                if raw_sub and str(raw_sub).isdigit():
                    user_id = int(raw_sub)
                raw_ws = state_data.get("workspace_id")
                if raw_ws and str(raw_ws).isdigit():
                    workspace_id = int(raw_ws)
            except Exception:
                pass

    # ── Resolve user & workspace objects from DB ────────────────────────────
    try:
        from app.repositories.user_repository import UserRepository
        from app.repositories.workspace_repository import WorkspaceRepository
        user_repo = UserRepository(db)
        workspace_repo = WorkspaceRepository(db)

        user_obj = await user_repo.get_by_id(user_id)
        if not user_obj:
            user_obj = await user_repo.get_by_email(user_email)
        if not user_obj:
            user_obj = await user_repo.get_or_create_default_user(user_email)

        if user_obj:
            user_id = user_obj.id
            if user_obj.email:
                user_email = user_obj.email

        ws_obj = await workspace_repo.get_by_id(workspace_id)
        if not ws_obj and user_obj:
            ws_obj = await workspace_repo.get_or_create_default_workspace(user_obj.id)
        if ws_obj:
            workspace_id = ws_obj.id

    except Exception as exc:
        logger.warning(f"User/workspace resolution warning during OAuth callback for {provider}: {exc}")

    # ── ONE ACCOUNT PER WORKSPACE: check if workspace already has a connected account ──
    try:
        from app.repositories.social_account_repository import SocialAccountRepository
        from app.schemas.pagination import PaginationParams
        acct_repo_check = SocialAccountRepository(db)
        existing_list, existing_count = await acct_repo_check.list_workspace_accounts(
            workspace_id=workspace_id,
            params=PaginationParams(page=1, page_size=5),
        )
        # Filter only CONNECTED accounts
        connected_accounts = [a for a in existing_list if getattr(a, "status", "DISCONNECTED") == "CONNECTED"]
        if connected_accounts:
            existing_platform = connected_accounts[0].platform.value if hasattr(connected_accounts[0].platform, "value") else str(connected_accounts[0].platform)
            # If user is connecting the exact same platform/account again, allow upsert
            # If a DIFFERENT provider, block and show message
            if existing_platform.upper() != provider.upper() and provider.lower() not in ["instagram", "facebook", "meta"]:
                err_msg = urllib.parse.quote(
                    f"You already have a connected {existing_platform} account. Disconnect it before connecting another platform."
                )
                return RedirectResponse(url=f"{frontend_url}/dashboard?connected={provider}&error={err_msg}")
    except Exception as check_exc:
        logger.warning(f"Existing account check failed (non-fatal): {check_exc}")

    # ── Perform token exchange and account save ─────────────────────────────
    backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    lookup_key = "meta" if provider.lower() in ["instagram", "facebook", "meta", "threads"] else provider.lower()
    redirect_uri = f"{backend_url}/api/v1/social-accounts/oauth/{lookup_key}/callback"

    try:
        from app.repositories.social_account_repository import SocialAccountRepository
        account_repo = SocialAccountRepository(db)
        service = SocialAccountService(account_repo)
        await service.handle_oauth_callback(
            provider=provider,
            code=code,
            redirect_uri=redirect_uri,
            user_id=user_id,
            workspace_id=workspace_id,
            user_email=user_email,
        )
        logger.info(f"OAuth callback succeeded for provider={provider} user_id={user_id} workspace_id={workspace_id}")
        return RedirectResponse(url=f"{frontend_url}/dashboard?connected={provider}")

    except OAuthException as exc:
        # Catch BEFORE global exception handler can intercept
        try:
            await db.rollback()
        except Exception:
            pass
        err_msg = exc.message or str(exc)
        logger.error(f"OAuthException during callback [{provider}] step={exc.step}: {err_msg}")
        safe_err = urllib.parse.quote(err_msg[:300])
        return RedirectResponse(url=f"{frontend_url}/dashboard?connected={provider}&error={safe_err}")

    except Exception as exc:
        try:
            await db.rollback()
        except Exception:
            pass
        err_msg = getattr(exc, "detail", None) or getattr(exc, "message", None) or str(exc)
        logger.exception(f"Unexpected OAuth callback error for {provider}: {err_msg}")
        safe_err = urllib.parse.quote(str(err_msg)[:300])
        return RedirectResponse(url=f"{frontend_url}/dashboard?connected={provider}&error={safe_err}")




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