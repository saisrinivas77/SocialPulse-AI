# app/utils/crypto.py
"""Fernet symmetric encryption cipher for storing OAuth access and refresh tokens."""

from cryptography.fernet import Fernet
from app.config import settings

fernet = Fernet(settings.ENCRYPTION_KEY.get_secret_value().encode())


def encrypt_token(plain_token: str) -> str:
    """Encrypt cleartext API token using Fernet AES cipher."""
    if not plain_token:
        return plain_token
    return fernet.encrypt(plain_token.encode()).decode()


def decrypt_token(cipher_token: str) -> str:
    """Decrypt Fernet encrypted token back to cleartext."""
    if not cipher_token:
        return cipher_token
    return fernet.decrypt(cipher_token.encode()).decode()