# app/api/routes/user.py

from __future__ import annotations

from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    Query,
    status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    UserResponse,
    UserUpdate,
)
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

DBSession = Annotated[
    AsyncSession,
    Depends(get_db),
]

CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


# ==========================================================
# Current User
# ==========================================================


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Current User",
    description="Returns the authenticated user's profile.",
)
async def get_me(
    db: DBSession,
    current_user: CurrentUser,
):
    service = UserService(db)

    return await service.get_my_profile(
        current_user,
    )


@router.put(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Current User",
    description="Update authenticated user's profile.",
)
async def update_me(
    payload: UserUpdate,
    db: DBSession,
    current_user: CurrentUser,
):
    service = UserService(db)

    return await service.update_my_profile(
        current_user,
        payload,
    )


@router.put(
    "/change-password",
    status_code=status.HTTP_200_OK,
    summary="Change Password",
    description="Change authenticated user's password.",
)
async def change_password(
    payload: ChangePasswordRequest,
    db: DBSession,
    current_user: CurrentUser,
):
    service = UserService(db)

    return await service.change_password(
        current_user,
        payload,
    )


# ==========================================================
# Admin Endpoints
# ==========================================================


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="List Users",
    description="List all users.",
)
async def list_users(
    db: DBSession,
    page: int = Query(
        1,
        ge=1,
    ),
    page_size: int = Query(
        20,
        ge=1,
        le=100,
    ),
):
    service = UserService(db)

    return await service.list_users(
        page=page,
        page_size=page_size,
    )


@router.get(
    "/search",
    status_code=status.HTTP_200_OK,
    summary="Search Users",
    description="Search users by username, email or name.",
)
async def search_users(
    keyword: str,
    db: DBSession,
    page: int = Query(
        1,
        ge=1,
    ),
    page_size: int = Query(
        20,
        ge=1,
        le=100,
    ),
):
    service = UserService(db)

    return await service.search_users(
        keyword=keyword,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User",
    description="Retrieve a user by ID.",
)
async def get_user(
    user_id: int,
    db: DBSession,
):
    service = UserService(db)

    user = await service.get_user(
        user_id,
    )

    return UserResponse.model_validate(
        user,
    )


@router.put(
    "/{user_id}/activate",
    status_code=status.HTTP_200_OK,
    summary="Activate User",
    description="Activate a user account.",
)
async def activate_user(
    user_id: int,
    db: DBSession,
):
    service = UserService(db)

    return await service.activate_user(
        user_id,
    )


@router.put(
    "/{user_id}/deactivate",
    status_code=status.HTTP_200_OK,
    summary="Deactivate User",
    description="Deactivate a user account.",
)
async def deactivate_user(
    user_id: int,
    db: DBSession,
):
    service = UserService(db)

    return await service.deactivate_user(
        user_id,
    )


@router.put(
    "/{user_id}/verify",
    status_code=status.HTTP_200_OK,
    summary="Verify User",
    description="Mark user as verified.",
)
async def verify_user(
    user_id: int,
    db: DBSession,
):
    service = UserService(db)

    return await service.verify_user(
        user_id,
    )