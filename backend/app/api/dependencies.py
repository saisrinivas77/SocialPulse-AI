# app/api/dependencies.py
"""FastAPI dependencies for Authentication, RBAC, and Service Providers."""

from typing import Annotated
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.workspace import WorkspaceRole
from app.repositories.media_repository import MediaRepository
from app.repositories.post_repository import PostRepository
from app.repositories.social_account_repository import SocialAccountRepository
from app.repositories.user_repository import UserRepository
from app.repositories.workspace_repository import WorkspaceRepository
from app.schemas.auth import TokenData
from app.services.auth_service import AuthService
from app.services.media_service import MediaService
from app.services.post_service import PostService
from app.services.social_account_service import SocialAccountService
from app.services.workspace_service import WorkspaceService
from app.utils.security import is_token_revoked

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """Validate bearer access token and verify revocation state in Redis."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY.get_secret_value(), algorithms=[settings.ALGORITHM]
        )
        user_id_str: str = payload.get("sub")
        jti: str = payload.get("jti")
        token_type: str = payload.get("type")

        if user_id_str is None or token_type != "access" or is_token_revoked(jti):
            raise credentials_exception

        token_data = TokenData(user_id=int(user_id_str))
    except (JWTError, ValueError):
        raise credentials_exception

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(token_data.user_id)
    if user is None or not user.is_active:
        raise credentials_exception
    return user


async def get_active_workspace_id(
    x_workspace_id: int = Header(
        ..., description="Active Multi-Tenant Workspace Header ID"
    ),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> int:
    """Assert authenticated user possesses membership in header workspace."""
    service = WorkspaceService(WorkspaceRepository(db))
    await service.verify_member_access(
        workspace_id=x_workspace_id,
        user_id=current_user.id,
        required_role=WorkspaceRole.MEMBER,
    )
    return x_workspace_id


from app.repositories.session_repository import SessionRepository
from app.repositories.oauth_account_repository import OAuthAccountRepository


def get_auth_service(session: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(
        user_repo=UserRepository(session),
        workspace_repo=WorkspaceRepository(session),
        session_repo=SessionRepository(session),
        oauth_repo=OAuthAccountRepository(session),
    )


def get_post_service(session: AsyncSession = Depends(get_db)) -> PostService:
    return PostService(PostRepository(session), MediaRepository(session))


def get_social_account_service(
    session: AsyncSession = Depends(get_db),
) -> SocialAccountService:
    return SocialAccountService(SocialAccountRepository(session))


def get_media_service(session: AsyncSession = Depends(get_db)) -> MediaService:
    return MediaService(MediaRepository(session))