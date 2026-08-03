"""
Common FastAPI Dependencies.
Re-exports dependencies for authentication and database sessions.
"""

from app.api.dependencies import (
    get_active_workspace_id,
    get_auth_service,
    get_current_user,
    get_media_service,
    get_post_service,
    get_social_account_service,
)
from app.database import get_db

get_current_active_user = get_current_user
get_current_admin_user = get_current_user

__all__ = [
    "get_db",
    "get_current_user",
    "get_current_active_user",
    "get_current_admin_user",
    "get_active_workspace_id",
    "get_auth_service",
    "get_post_service",
    "get_social_account_service",
    "get_media_service",
]