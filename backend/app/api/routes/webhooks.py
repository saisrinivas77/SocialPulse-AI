# app/api/routes/webhooks.py
"""Webhook receiver handling social network callbacks."""

import logging
from fastapi import APIRouter, Query, Request, Response, status

from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Social Provider Webhooks"])


@router.get("/meta", status_code=status.HTTP_200_OK, summary="Meta Webhook Verification")
async def verify_meta_webhook(
    hub_mode: str = Query(..., alias="hub.mode"),
    hub_challenge: str = Query(..., alias="hub.challenge"),
    hub_verify_token: str = Query(..., alias="hub.verify_token"),
) -> Response:
    """Handshake verification for Meta (Instagram/Facebook) webhooks."""
    if (
        hub_mode == "subscribe"
        and hub_verify_token == settings.META_WEBHOOK_VERIFY_TOKEN.get_secret_value()
    ):
        return Response(content=hub_challenge, media_type="text/plain")
    return Response(status_code=status.HTTP_403_FORBIDDEN)


@router.post("/meta", status_code=status.HTTP_200_OK, summary="Meta Event Receiver")
async def process_meta_webhook(request: Request) -> dict:
    """Receive asynchronous callback events from Meta."""
    body = await request.json()
    logger.info("Received Meta Webhook Payload", extra={"payload": body})
    return {"status": "received"}