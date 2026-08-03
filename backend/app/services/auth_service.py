# app/services/auth_service.py
"""Authentication service supporting refresh tokens and token revocation."""

import logging
from jose import JWTError, jwt

from app.config import settings
from app.exceptions.custom import ConflictException, ValidationException
from app.repositories.user_repository import UserRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.auth import Token, UserRegister, UserResponse
from app.utils.security import (
    create_jwt_token,
    get_password_hash,
    is_token_revoked,
    revoke_token,
    verify_password,
)

logger = logging.getLogger(__name__)


class AuthService:
    """Service handling tenant registration, JWT issuance, rotation, and revocation."""

    def __init__(
        self, user_repo: UserRepository, workspace_repo: WorkspaceRepository
    ) -> None:
        self.user_repo = user_repo
        self.workspace_repo = workspace_repo

    async def register_user(self, data: UserRegister) -> UserResponse:
        """Register a user and provision initial default Organization and Workspace."""
        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise ConflictException("User with this email already exists.")

        full_name_parts = [part for part in data.full_name.strip().split() if part]
        first_name = full_name_parts[0] if full_name_parts else data.full_name.strip()
        last_name = " ".join(full_name_parts[1:]) if len(full_name_parts) > 1 else first_name
        username = data.email.split("@", 1)[0].lower().strip()

        user = await self.user_repo.create(
            email=data.email.lower().strip(),
            username=username,
            first_name=first_name,
            last_name=last_name,
            hashed_password=get_password_hash(data.password),
        )

        await self.workspace_repo.create_workspace_with_org(
            user_id=user.id,
            org_name=data.organization_name,
            workspace_name=f"{data.full_name}'s Workspace",
        )
        logger.info(f"Registered user {user.id} and created default workspace.")
        return UserResponse.model_validate(user)

    async def authenticate_user(self, email: str, password: str) -> Token:
        """Authenticate credentials and issue access + refresh tokens."""
        user = await self.user_repo.get_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            raise ValidationException("Invalid email or password.")

        if not user.is_active:
            raise ValidationException("Account is inactive.")

        access_token = create_jwt_token(subject=user.id, token_type="access")
        refresh_token = create_jwt_token(subject=user.id, token_type="refresh")

        return Token(access_token=access_token, refresh_token=refresh_token)

    async def rotate_refresh_token(self, refresh_token_str: str) -> Token:
        """Rotate refresh token and issue a fresh token pair."""
        try:
            payload = jwt.decode(
                refresh_token_str,
                settings.SECRET_KEY.get_secret_value(),
                algorithms=[settings.ALGORITHM],
            )
            jti = payload.get("jti")
            token_type = payload.get("type")
            user_id = payload.get("sub")

            if token_type != "refresh" or is_token_revoked(jti):
                raise ValidationException("Invalid or revoked refresh token.")

            revoke_token(jti, ttl_seconds=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60)

            access_token = create_jwt_token(subject=user_id, token_type="access")
            new_refresh_token = create_jwt_token(subject=user_id, token_type="refresh")

            return Token(access_token=access_token, refresh_token=new_refresh_token)
        except JWTError:
            raise ValidationException("Invalid token signature.")

    async def logout(self, refresh_token_str: str) -> None:
        """Revoke refresh token."""
        try:
            payload = jwt.decode(
                refresh_token_str,
                settings.SECRET_KEY.get_secret_value(),
                algorithms=[settings.ALGORITHM],
            )
            jti = payload.get("jti")
            if jti:
                revoke_token(jti, ttl_seconds=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60)
        except JWTError:
            pass