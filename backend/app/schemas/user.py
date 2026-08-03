from __future__ import annotations

from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ==========================================================
# ENUMS
# ==========================================================


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


# ==========================================================
# BASE
# ==========================================================


class UserBase(BaseModel):
    first_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    last_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
    )

    email: EmailStr

    phone_number: str | None = Field(
        default=None,
        max_length=20,
    )

    bio: str | None = Field(
        default=None,
        max_length=500,
    )

    profile_image: str | None = None


# ==========================================================
# CREATE
# ==========================================================


class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
    )


# ==========================================================
# UPDATE
# ==========================================================


class UserUpdate(BaseModel):
    first_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    last_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    username: str | None = Field(
        default=None,
        min_length=3,
        max_length=50,
    )

    phone_number: str | None = Field(
        default=None,
        max_length=20,
    )

    bio: str | None = Field(
        default=None,
        max_length=500,
    )

    profile_image: str | None = None

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# CHANGE PASSWORD
# ==========================================================


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(
        ...,
        min_length=8,
    )

    new_password: str = Field(
        ...,
        min_length=8,
    )


# ==========================================================
# RESPONSE
# ==========================================================


class UserResponse(UserBase):
    id: int | UUID

    role: UserRole

    status: UserStatus

    is_verified: bool

    is_active: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# PUBLIC PROFILE
# ==========================================================


class UserProfile(UserResponse):
    full_name: str


# ==========================================================
# LIST RESPONSE
# ==========================================================


class UserListResponse(BaseModel):
    users: list[UserResponse]

    total: int

    page: int

    page_size: int

    model_config = ConfigDict(
        from_attributes=True,
    )