from fastapi import APIRouter

from app.api.routes.admin import router as admin_router
from app.api.routes.ai import router as ai_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.api_keys import router as api_keys_router
from app.api.routes.audit_logs import router as audit_logs_router
from app.api.routes.auth import router as auth_router
from app.api.routes.billing import router as billing_router
from app.api.routes.caption import router as caption_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.hashtag import router as hashtag_router
from app.api.routes.health import router as health_router
from app.api.routes.jobs import router as jobs_router
from app.api.routes.media import router as media_router
from app.api.routes.notifications import router as notifications_router
from app.api.routes.post import router as post_router
from app.api.routes.reports import router as reports_router
from app.api.routes.search import router as search_router
from app.api.routes.security import router as security_router
from app.api.routes.sentiment import router as sentiment_router
from app.api.routes.settings import router as settings_router
from app.api.routes.social_account import router as social_account_router
from app.api.routes.user import router as user_router
from app.api.routes.webhooks import router as webhooks_router
from app.api.routes.websocket import router as websocket_router
from app.api.routes.workspaces import router as workspaces_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(security_router)
api_router.include_router(user_router)
api_router.include_router(workspaces_router)
api_router.include_router(social_account_router)
api_router.include_router(post_router)
api_router.include_router(media_router)
api_router.include_router(analytics_router)
api_router.include_router(dashboard_router)
api_router.include_router(ai_router)
api_router.include_router(notifications_router)
api_router.include_router(audit_logs_router)
api_router.include_router(api_keys_router)
api_router.include_router(settings_router)
api_router.include_router(search_router)
api_router.include_router(reports_router)
api_router.include_router(jobs_router)
api_router.include_router(sentiment_router)
api_router.include_router(hashtag_router)
api_router.include_router(caption_router)
api_router.include_router(webhooks_router)
api_router.include_router(admin_router)
api_router.include_router(websocket_router)
api_router.include_router(billing_router)