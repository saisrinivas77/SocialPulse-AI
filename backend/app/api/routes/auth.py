# app/api/routes/auth.py
"""Authentication router handling registration, token rotation, and logout."""

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm

from app.api.dependencies import get_auth_service
from app.schemas.auth import (
    LogoutRequest,
    RefreshTokenRequest,
    Token,
    UserRegister,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


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
    """Register user and provision initial organization workspace."""
    return await auth_service.register_user(payload)


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Login for JWT tokens",
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
) -> Token:
    """Authenticate credentials and issue access + refresh token pair."""
    return await auth_service.authenticate_user(
        email=form_data.username, password=form_data.password
    )


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
    summary="Logout and revoke token",
)
async def logout(
    payload: LogoutRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> Response:
    """Blacklist refresh token in Redis."""
    await auth_service.logout(payload.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)