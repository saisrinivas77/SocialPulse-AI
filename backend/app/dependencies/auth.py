from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.security import (
    oauth2_scheme,
    verify_access_token,
)
from app.database import get_db
from app.repositories import user_repository


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = verify_access_token(token)
        user_id = int(payload["sub"])

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = user_repository.get_by_id(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user