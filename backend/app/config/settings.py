from functools import lru_cache
from typing import List, Optional
from urllib.parse import quote_plus

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    SENTRY_DSN: Optional[str] = Field(default=None)

    # ==========================================================
    # PROJECT
    # ==========================================================

    PROJECT_NAME: str = "SocialPulse AI"
    PROJECT_DESCRIPTION: str = "AI Powered Social Media Analytics Platform"
    VERSION: str = "1.0.0"

    APP_ENV: str = "development"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    API_V1_STR: str = "/api/v1"

    # ==========================================================
    # DATABASE
    # ==========================================================

    DATABASE_URL: Optional[str] = Field(default=None)
    ASYNC_DATABASE_URL: Optional[str] = Field(default=None)

    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "socialpulse_ai"

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        import os
        url = self.DATABASE_URL or os.getenv("DATABASE_URL")
        if url:
            if url.startswith("postgres://"):
                return url.replace("postgres://", "postgresql+psycopg2://", 1)
            elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
                return url.replace("postgresql://", "postgresql+psycopg2://", 1)
            return url

        password = quote_plus(self.DB_PASSWORD)
        return (
            f"mysql+pymysql://"
            f"{self.DB_USER}:{password}"
            f"@{self.DB_HOST}:{self.DB_PORT}"
            f"/{self.DB_NAME}"
        )

    @property
    def ASYNC_SQLALCHEMY_DATABASE_URI(self) -> str:
        import os
        url = self.ASYNC_DATABASE_URL or os.getenv("ASYNC_DATABASE_URL") or self.DATABASE_URL or os.getenv("DATABASE_URL")
        if url:
            if "postgres" in url:
                if url.startswith("postgres://"):
                    return url.replace("postgres://", "postgresql+asyncpg://", 1)
                elif url.startswith("postgresql://"):
                    return url.replace("postgresql://", "postgresql+asyncpg://", 1)
                return url

            if "mysql" in url:
                try:
                    import aiomysql  # noqa
                    if url.startswith("mysql://"):
                        return url.replace("mysql://", "mysql+aiomysql://", 1)
                    return url
                except ImportError:
                    return "sqlite+aiosqlite:///./socialpulse_dev.db"

            if url.startswith("sqlite://"):
                return url.replace("sqlite://", "sqlite+aiosqlite://", 1)

            return url

        password = quote_plus(self.DB_PASSWORD)
        try:
            import aiomysql  # noqa
            return (
                f"mysql+aiomysql://"
                f"{self.DB_USER}:{password}"
                f"@{self.DB_HOST}:{self.DB_PORT}"
                f"/{self.DB_NAME}"
            )
        except ImportError:
            return "sqlite+aiosqlite:///./socialpulse_dev.db"

    # ==========================================================
    # JWT
    # ==========================================================

    SECRET_KEY: SecretStr = SecretStr("change_this_secret_key")

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    @property
    def REFRESH_TOKEN_EXPIRE_MINUTES(self) -> int:
        return self.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60

    META_WEBHOOK_VERIFY_TOKEN: SecretStr = SecretStr("default-webhook-verify-token")

    # ==========================================================
    # ENCRYPTION
    # ==========================================================

    ENCRYPTION_KEY: SecretStr = SecretStr(
        "diirruluPNUmbWfYgX4iABpCiul-CIQl0q1c0o2pPGs="
    )

    # ==========================================================
    # REDIS
    # ==========================================================

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str = ""

    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return (
                f"redis://:{self.REDIS_PASSWORD}"
                f"@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
            )
        return (
            f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        )

    # ==========================================================
    # CORS
    # ==========================================================

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # ==========================================================
    # AWS S3
    # ==========================================================

    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "ap-south-1"
    AWS_S3_BUCKET: str = ""
    S3_BUCKET_NAME: str = "socialpulse-media-bucket"
    S3_ENDPOINT_URL: Optional[str] = None

    # ==========================================================
    # FILE STORAGE
    # ==========================================================

    STORAGE_TYPE: str = "local"

    UPLOAD_DIR: str = "uploads"
    PROFILE_UPLOAD_DIR: str = "uploads/profile"
    POST_UPLOAD_DIR: str = "uploads/posts"

    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024

    # ==========================================================
    # AI
    # ==========================================================

    OPENAI_API_KEY: str = ""

    AI_MODEL: str = "gpt-4.1-mini"

    HUGGINGFACE_MODEL: str = (
        "cardiffnlp/twitter-roberta-base-sentiment"
    )

    # ==========================================================
    # EMAIL
    # ==========================================================

    SMTP_SERVER: str = ""
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""

    # ==========================================================
    # CELERY
    # ==========================================================

    CELERY_BROKER_URL: str = "redis://localhost:6379/0"

    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # ==========================================================
    # LOGGING
    # ==========================================================

    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/socialpulse.log"

    # ==========================================================
    # SECURITY
    # ==========================================================

    PASSWORD_MIN_LENGTH: int = 8

    ACCESS_TOKEN_COOKIE_NAME: str = "access_token"

    REFRESH_TOKEN_COOKIE_NAME: str = "refresh_token"

    COOKIE_SECURE: bool = False

    COOKIE_HTTPONLY: bool = True

    COOKIE_SAMESITE: str = "lax"

    # ==========================================================
    # RATE LIMITING
    # ==========================================================

    RATE_LIMIT: str = "100/minute"

    # ==========================================================
    # PAGINATION
    # ==========================================================

    DEFAULT_PAGE_SIZE: int = 20

    MAX_PAGE_SIZE: int = 100

    # ==========================================================
    # SOCIAL PROVIDERS & OAUTH CREDENTIALS
    # ==========================================================

    DEMO_MODE: bool = False

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: SecretStr = SecretStr("")
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    YOUTUBE_API_KEY: str = ""

    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: SecretStr = SecretStr("")

    MICROSOFT_CLIENT_ID: str = ""
    MICROSOFT_CLIENT_SECRET: SecretStr = SecretStr("")
    MICROSOFT_TENANT_ID: str = ""

    LINKEDIN_CLIENT_ID: str = ""
    LINKEDIN_CLIENT_SECRET: SecretStr = SecretStr("")

    META_APP_ID: str = ""
    META_APP_SECRET: SecretStr = SecretStr("")

    TWITTER_CLIENT_ID: str = ""
    TWITTER_CLIENT_SECRET: SecretStr = SecretStr("")

    TIKTOK_CLIENT_ID: str = ""
    TIKTOK_CLIENT_SECRET: SecretStr = SecretStr("")

    PINTEREST_CLIENT_ID: str = ""
    PINTEREST_CLIENT_SECRET: SecretStr = SecretStr("")

    RESEND_API_KEY: SecretStr = SecretStr("")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()