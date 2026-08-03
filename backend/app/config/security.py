from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config.settings import settings

# ==========================================================
# Password Hashing
# ==========================================================

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)

# ==========================================================
# OAuth2
# ==========================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)

# ==========================================================
# Password Functions
# ==========================================================


def hash_password(password: str) -> str:
    """
    Hash a plain text password.
    """
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify password.
    """
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# ==========================================================
# JWT Functions
# ==========================================================


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Generate JWT access token.
    """

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode.update(
        {
            "exp": expire,
            "type": "access",
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY.get_secret_value(),
        algorithm=settings.ALGORITHM,
    )

    return encoded_jwt


def create_refresh_token(
    data: Dict[str, Any],
) -> str:
    """
    Generate refresh token.
    """

    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload = data.copy()

    payload.update(
        {
            "exp": expire,
            "type": "refresh",
        }
    )

    return jwt.encode(
        payload,
        settings.SECRET_KEY.get_secret_value(),
        algorithm=settings.ALGORITHM,
    )


# ==========================================================
# Token Verification
# ==========================================================


def decode_token(
    token: str,
) -> Optional[Dict[str, Any]]:
    """
    Decode JWT token.
    """

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY.get_secret_value(),
            algorithms=[settings.ALGORITHM],
        )

        return payload

    except JWTError:

        return None


def verify_access_token(
    token: str,
) -> Dict[str, Any]:
    """
    Verify JWT access token.
    """

    payload = decode_token(token)

    if payload is None:
        raise JWTError("Invalid token")

    if payload.get("type") != "access":
        raise JWTError("Invalid access token")

    return payload


def verify_refresh_token(
    token: str,
) -> Dict[str, Any]:
    """
    Verify refresh token.
    """

    payload = decode_token(token)

    if payload is None:
        raise JWTError("Invalid token")

    if payload.get("type") != "refresh":
        raise JWTError("Invalid refresh token")

    return payload


# ==========================================================
# Utility
# ==========================================================


def create_token_pair(
    user_id: int,
    email: str,
) -> Dict[str, str]:
    """
    Create access and refresh tokens.
    """

    payload = {
        "sub": str(user_id),
        "email": email,
    }

    return {
        "access_token": create_access_token(payload),
        "refresh_token": create_refresh_token(payload),
        "token_type": "bearer",
    }