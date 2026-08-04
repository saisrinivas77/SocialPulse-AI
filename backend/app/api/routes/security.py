# app/api/routes/security.py
"""Security Center router for managing connected providers, active devices, sessions, audit logs, and passwords."""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.repositories.session_repository import SessionRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ChangePasswordRequest, SessionResponse
from app.utils.security import get_password_hash, verify_password

router = APIRouter(prefix="/security", tags=["Security Center"])


@router.get("/overview", summary="Fetch Security Center status overview")
async def get_security_overview(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Retrieve security status overview, connected login providers, 2FA readiness, and active devices count."""
    session_repo = SessionRepository(db)
    active_sessions = await session_repo.list_active_user_sessions(current_user.id)

    connected_providers = []
    if current_user.provider:
        connected_providers.append({
            "provider": current_user.provider,
            "connected_at": current_user.created_at.isoformat() if current_user.created_at else None,
            "status": "Active",
            "is_primary": True,
        })

    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "is_verified": current_user.is_verified,
        "two_factor_enabled": False,
        "two_factor_ready": True,
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
        "active_sessions_count": len(active_sessions),
        "connected_providers": connected_providers,
        "security_score": 95 if current_user.is_verified else 70,
    }


@router.get("/sessions", response_model=List[SessionResponse], summary="List active login devices/sessions")
async def get_active_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[SessionResponse]:
    """List active devices and login sessions for current user."""
    session_repo = SessionRepository(db)
    sessions = await session_repo.list_active_user_sessions(current_user.id)
    return [SessionResponse.model_validate(s) for s in sessions]


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Revoke a specific device session")
async def revoke_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke specific device session."""
    session_repo = SessionRepository(db)
    session_obj = await session_repo.get_by_id(session_id)
    if not session_obj or session_obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")

    session_obj.is_active = False
    await db.commit()
    return None


@router.post("/change-password", status_code=status.HTTP_200_OK, summary="Change current account password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Validate current password and set new password."""
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    user_repo = UserRepository(db)
    current_user.hashed_password = get_password_hash(payload.new_password)
    await user_repo.save()
    return {"message": "Password changed successfully."}
