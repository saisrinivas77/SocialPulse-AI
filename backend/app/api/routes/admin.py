# app/api/routes/admin.py
"""Super Admin Console Router."""

from fastapi import APIRouter, Depends, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.post import Post
from app.models.social_account import SocialAccount

router = APIRouter(
    prefix="/admin",
    tags=["Admin Console"],
)


@router.get("", status_code=status.HTTP_200_OK, summary="Admin System Health Overview")
async def admin_overview():
    return {"status": "ok", "system_health": "100%", "active_services": ["API", "DB", "Redis", "Celery"]}


@router.get("/users", status_code=status.HTTP_200_OK, summary="Admin User List & Statuses")
async def admin_list_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(User).limit(50)
    res = await db.execute(stmt)
    users = res.scalars().all()
    return [{"id": u.id, "email": u.email, "is_active": u.is_active, "created_at": u.created_at} for u in users]


@router.get("/platform-stats", status_code=status.HTTP_200_OK, summary="Platform Aggregate Statistics")
async def admin_platform_stats(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    users_cnt = (await db.execute(select(func.count(User.id)))).scalar_one()
    posts_cnt = (await db.execute(select(func.count(Post.id)))).scalar_one()
    accs_cnt = (await db.execute(select(func.count(SocialAccount.id)))).scalar_one()
    return {
        "total_registered_users": users_cnt,
        "total_posts_created": posts_cnt,
        "total_connected_accounts": accs_cnt,
    }


@router.get("/feature-flags", status_code=status.HTTP_200_OK, summary="Platform Feature Flags")
async def admin_feature_flags(current_user: User = Depends(get_current_user)):
    return {
        "ai_generation_enabled": True,
        "celery_async_publishing": True,
        "meta_graph_api_v19": True,
        "maintenance_mode": False,
    }


@router.get("/subscriptions", status_code=status.HTTP_200_OK, summary="Tenant Subscription Breakdown")
async def admin_subscriptions(current_user: User = Depends(get_current_user)):
    return {
        "free_tier": 120,
        "pro_tier": 45,
        "enterprise_tier": 8,
        "mrr_usd": 14250.00,
    }
