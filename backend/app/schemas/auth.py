# app/schemas/auth.py
"""Pydantic schemas for auth, registration, and token management."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    """Registration payload."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)
    organization_name: str = Field(..., min_length=1)


class UserResponse(BaseModel):
    """User response model."""

    id: int
    email: EmailStr
    full_name: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Authentication tokens response containing access and refresh keys."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Request payload for rotating refresh token."""

    refresh_token: str


class LogoutRequest(BaseModel):
    """Request payload for revoking active tokens."""

    refresh_token: str


class TokenData(BaseModel):
    """Payload data decoded from JWT."""

    user_id: int | None = None
    jti: str | None = None
    token_type: str | None = None