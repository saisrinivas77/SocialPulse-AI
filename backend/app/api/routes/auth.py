# app/api/routes/auth.py
"""Authentication router handling email auth, verification, OAuth providers, demo login, and session control."""

import logging
import os
import base64
import json
import urllib.parse
from urllib.parse import urlparse
from typing import Optional, List

logger = logging.getLogger(__name__)
from fastapi import APIRouter, Depends, Request, Response, Query, status
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm

from app.api.dependencies import get_auth_service, get_current_user
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LogoutRequest,
    RefreshTokenRequest,
    ResendVerificationRequest,
    ResetPasswordRequest,
    Token,
    UserRegister,
    UserResponse,
)
from app.config import settings
from app.services.auth_service import AuthService
from app.services.oauth_service import oauth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _extract_client_info(request: Request) -> dict:
    """Extract telemetry metadata from incoming HTTP request."""
    user_agent = request.headers.get("user-agent", "")
    ip = request.client.host if request.client else "127.0.0.1"

    device_type = "mobile" if "mobile" in user_agent.lower() else "desktop"
    os_name = "macOS" if "Mac" in user_agent else "Windows" if "Windows" in user_agent else "Linux"
    browser_name = "Chrome" if "Chrome" in user_agent else "Safari" if "Safari" in user_agent else "Firefox"

    return {
        "ip_address": ip,
        "user_agent": user_agent,
        "device_type": device_type,
        "os_name": os_name,
        "browser_name": browser_name,
    }


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new tenant user",
)
async def register(
    payload: UserRegister,
    auth_service: AuthService = Depends(get_auth_service),
) -> UserResponse:
    """Register user, send verification email, and provision initial organization workspace."""
    return await auth_service.register_user(payload)


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Login for JWT tokens",
)
async def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
) -> Token:
    """Authenticate email/password credentials and issue access + refresh token pair."""
    client_info = _extract_client_info(request)
    return await auth_service.authenticate_user(
        email=form_data.username,
        password=form_data.password,
        client_info=client_info,
    )


@router.post(
    "/demo-login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Seed and login with demo user account",
)
async def demo_login(
    request: Request,
    auth_service: AuthService = Depends(get_auth_service),
) -> Token:
    """Seed demo account (demo@socialpulse.ai) and issue JWT tokens."""
    client_info = _extract_client_info(request)
    return await auth_service.authenticate_demo_user(client_info=client_info)


@router.get(
    "/verify-email",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify user email address",
)
async def verify_email(
    token: str = Query(..., description="Verification token sent to user email"),
    auth_service: AuthService = Depends(get_auth_service),
) -> UserResponse:
    """Verify token, activate account, and send welcome email."""
    return await auth_service.verify_email(token)


@router.post(
    "/send-verification",
    status_code=status.HTTP_200_OK,
    summary="Send or resend verification email",
)
@router.post(
    "/resend-verification",
    status_code=status.HTTP_200_OK,
    summary="Resend verification email",
)
async def resend_verification(
    payload: ResendVerificationRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Resend email verification link."""
    await auth_service.resend_verification_email(payload.email)
    return {"message": "If account exists, verification email has been dispatched."}


@router.post(
    "/forgot-password",
    status_code=status.HTTP_200_OK,
    summary="Initiate password recovery",
)
async def forgot_password(
    payload: ForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Send password reset email."""
    await auth_service.forgot_password(payload.email)
    return {"message": "If account exists, password reset instructions have been sent."}


@router.post(
    "/reset-password",
    status_code=status.HTTP_200_OK,
    summary="Finalize password reset",
)
async def reset_password(
    payload: ResetPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Reset password with token."""
    await auth_service.reset_password(token=payload.token, new_password=payload.new_password)
    return {"message": "Password updated successfully. You may now log in."}


# ─── OAuth Login Routes ───────────────────────────────────────────────────────
@router.get(
    "/{provider}/login",
    summary="OAuth 2.0 Provider Login Authorization Redirect",
)
async def oauth_login_redirect(
    provider: str,
    request: Request,
) -> RedirectResponse:
    """Redirect to official OAuth provider login (Google, Microsoft, GitHub, Apple, LinkedIn)."""
    if provider.lower() == "google" and getattr(settings, "GOOGLE_REDIRECT_URI", None):
        redirect_uri = settings.GOOGLE_REDIRECT_URI
    else:
        backend_url = os.getenv("BACKEND_URL", str(request.base_url).rstrip("/"))
        redirect_uri = f"{backend_url}/api/v1/auth/{provider}/callback"

    # Detect the real frontend origin from the Referer header sent when the
    # browser first navigates to this endpoint (not the callback chain referer).
    raw_referer = request.headers.get("referer") or request.headers.get("origin") or ""
    if raw_referer:
        parsed = urlparse(raw_referer)
        frontend_origin = f"{parsed.scheme}://{parsed.netloc}"
    else:
        frontend_origin = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Encode frontend_origin into state so the callback can reliably redirect back
    state_payload = base64.urlsafe_b64encode(
        json.dumps({"frontend_url": frontend_origin}).encode()
    ).decode()

    auth_url = oauth_service.get_login_authorization_url(
        provider=provider,
        redirect_uri=redirect_uri,
        state=state_payload,
    )
    return RedirectResponse(url=auth_url)


@router.get(
    "/{provider}/callback",
    summary="OAuth 2.0 Provider Callback Endpoint",
)
async def oauth_login_callback(
    provider: str,
    request: Request,
    code: str = Query(..., description="Authorization code from provider"),
    auth_service: AuthService = Depends(get_auth_service),
):
    """Process OAuth code, fetch user profile, merge account, and redirect to frontend with tokens."""
    if provider.lower() == "google" and getattr(settings, "GOOGLE_REDIRECT_URI", None):
        redirect_uri = settings.GOOGLE_REDIRECT_URI
    else:
        backend_url = os.getenv("BACKEND_URL", str(request.base_url).rstrip("/"))
        redirect_uri = f"{backend_url}/api/v1/auth/{provider}/callback"

    try:
        client_info = _extract_client_info(request)
        profile = await oauth_service.get_login_user_profile(provider=provider, code=code, redirect_uri=redirect_uri)

        token_pair = await auth_service.authenticate_oauth_user(
            provider=provider,
            provider_user_id=profile["provider_user_id"],
            email=profile["email"],
            full_name=profile["full_name"],
            avatar_url=profile.get("avatar_url"),
            client_info=client_info,
        )

        # Decode state to recover frontend_url encoded by oauth_login_redirect
        state = request.query_params.get("state", "")
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        if state:
            try:
                decoded = json.loads(base64.urlsafe_b64decode(state + "==").decode())
                frontend_url = decoded.get("frontend_url", frontend_url)
            except Exception:
                pass  # malformed state — use env default

        # Ensure frontend_url is never the backend itself
        backend_origin = str(request.base_url).rstrip("/")
        if frontend_url.startswith(backend_origin):
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

        target_url = f"{frontend_url}/login?access_token={token_pair.access_token}&refresh_token={token_pair.refresh_token}"
        return RedirectResponse(url=target_url)
    except Exception as exc:
        logger.error(f"OAuth callback failed for {provider}: {str(exc)}", exc_info=True)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        error_msg = urllib.parse.quote(str(exc))
        return RedirectResponse(url=f"{frontend_url}/login?error=oauth_failed&provider={provider}&details={error_msg}")


@router.post(
    "/refresh",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Rotate refresh token",
)
async def refresh_token(
    payload: RefreshTokenRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> Token:
    """Rotate refresh token and issue new token pair."""
    return await auth_service.rotate_refresh_token(payload.refresh_token)


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Logout and revoke active session",
)
async def logout(
    payload: LogoutRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> Response:
    """Revoke refresh token and terminate active session."""
    await auth_service.logout(payload.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/logout-all",
    status_code=status.HTTP_200_OK,
    summary="Logout user from all devices",
)
async def logout_all(
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> dict:
    """Revoke all active sessions across all devices for the current user."""
    await auth_service.logout_all_devices(current_user.id)
    return {"message": "Logged out from all active devices."}