# app/exceptions/custom.py
"""Application domain exceptions re-exported from canonical exceptions package."""

from app.exceptions.exceptions import (
    AppException,
    ConflictException,
    ForbiddenException,
    NotFoundException,
    OAuthException,
    ServiceException,
    UnauthorizedException,
    ValidationException,
)

__all__ = [
    "AppException",
    "ServiceException",
    "NotFoundException",
    "ForbiddenException",
    "ValidationException",
    "ConflictException",
    "UnauthorizedException",
    "OAuthException",
]