# app/utils/security.py
"""Security utilities for hashing, token creation, and Redis token revocation."""

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Union

from jose import jwt
from passlib.context import CryptContext

from app.config import settings

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def _get_redis_client():
    """Lazily create Redis client to avoid import-time connection failures."""
    try:
        import redis
        return redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
    except Exception:
        logger.warning("Redis client initialization failed, token revocation disabled.")
        return None


# Lazy singleton
_redis_client = None


def _redis():
    """Get or create Redis client singleton."""
    global _redis_client
    if _redis_client is None:
        _redis_client = _get_redis_client()
    return _redis_client


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password match against the configured password hash scheme."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate a password hash using the configured scheme."""
    return pwd_context.hash(password)


def create_jwt_token(
    subject: Union[str, Any], token_type: str, expires_delta: timedelta | None = None
) -> str:
    """Issue a signed JWT access or refresh token with unique jti."""
    import uuid

    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        minutes = (
            settings.ACCESS_TOKEN_EXPIRE_MINUTES
            if token_type == "access"
            else settings.REFRESH_TOKEN_EXPIRE_MINUTES
        )
        expire = now + timedelta(minutes=minutes)

    jti = str(uuid.uuid4())
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": token_type,
        "jti": jti,
    }
    return jwt.encode(
        to_encode, settings.SECRET_KEY.get_secret_value(), algorithm=settings.ALGORITHM
    )


def create_oauth_state_token(user_id: int, workspace_id: int, provider: str) -> str:
    """Issue a signed OAuth state token valid for 30 minutes."""
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=30)
    to_encode = {
        "type": "oauth_state",
        "sub": str(user_id),
        "workspace_id": workspace_id,
        "provider": provider,
        "exp": expire,
    }
    return jwt.encode(
        to_encode, settings.SECRET_KEY.get_secret_value(), algorithm=settings.ALGORITHM
    )


def decode_oauth_state_token(token: str) -> dict:
    """Decode and verify 30-minute signed OAuth state token."""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY.get_secret_value(), algorithms=[settings.ALGORITHM]
        )
        if payload.get("type") == "oauth_state":
            return payload
    except Exception:
        pass
    return {}


def revoke_token(jti: str, ttl_seconds: int) -> None:
    """Revoke token by storing jti in Redis blacklist."""
    client = _redis()
    if client is None:
        return
    try:
        client.setex(f"token_blacklist:{jti}", ttl_seconds, "revoked")
    except Exception:
        logger.warning("Failed to revoke token in Redis", exc_info=True)


def is_token_revoked(jti: str) -> bool:
    """Check if token jti exists in Redis blacklist."""
    if jti is None:
        return False
    client = _redis()
    if client is None:
        return False
    try:
        return client.exists(f"token_blacklist:{jti}") == 1
    except Exception:
        logger.warning("Failed to check token revocation in Redis", exc_info=True)
        return False


def encrypt_token(plain_token: str) -> str:
    """Encrypt OAuth access/refresh token using AES-256 Fernet encryption."""
    import base64
    from cryptography.fernet import Fernet

    if not plain_token:
        return ""
    secret = settings.SECRET_KEY.get_secret_value()
    # Derive a valid 32-byte Fernet key from SECRET_KEY
    key = base64.urlsafe_b64encode(secret.zfill(32)[:32].encode())
    fernet = Fernet(key)
    return fernet.encrypt(plain_token.encode()).decode()


def decrypt_token(encrypted_token: str) -> str:
    """Decrypt AES-256 Fernet encrypted OAuth token."""
    import base64
    from cryptography.fernet import Fernet

    if not encrypted_token:
        return ""
    try:
        secret = settings.SECRET_KEY.get_secret_value()
        key = base64.urlsafe_b64encode(secret.zfill(32)[:32].encode())
        fernet = Fernet(key)
        return fernet.decrypt(encrypted_token.encode()).decode()
    except Exception:
        # Fallback if token was unencrypted during development
        return encrypted_token