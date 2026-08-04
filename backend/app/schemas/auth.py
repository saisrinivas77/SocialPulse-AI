# app/schemas/auth.py
"""Pydantic schemas for auth, registration, tokens, sessions, and email verification."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    """Registration payload."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=1)
    organization_name: str = Field(default="My Organization", min_length=1)
    company_name: Optional[str] = None


class UserResponse(BaseModel):
    """User response model."""

    id: int
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: str
    avatar_url: Optional[str] = None
    provider: str = "email"
    role: str = "user"
    is_active: bool = True
    is_verified: bool = False
    last_login: Optional[datetime] = None
    workspace_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    """Authentication tokens response containing access and refresh keys."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None


class RefreshTokenRequest(BaseModel):
    """Request payload for rotating refresh token."""

    refresh_token: str


class LogoutRequest(BaseModel):
    """Request payload for revoking active tokens."""

    refresh_token: str


class ForgotPasswordRequest(BaseModel):
    """Request payload to initiate password reset."""

    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Request payload to finalize password reset with token."""

    token: str
    new_password: str = Field(..., min_length=8)


class ChangePasswordRequest(BaseModel):
    """Request payload for authenticated password update."""

    current_password: str
    new_password: str = Field(..., min_length=8)


class ResendVerificationRequest(BaseModel):
    """Request payload to resend email verification link."""

    email: EmailStr


class SessionResponse(BaseModel):
    """Active user session representation."""

    id: int
    refresh_token_jti: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device_type: str = "desktop"
    os_name: Optional[str] = None
    browser_name: Optional[str] = None
    is_active: bool = True
    last_active: datetime
    is_current: bool = False

    model_config = ConfigDict(from_attributes=True)


class TokenData(BaseModel):
    """Payload data decoded from JWT."""

    user_id: int | None = None
    jti: str | None = None
    token_type: str | None = None