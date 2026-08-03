# app/api/routes/ai.py
"""Expanded AI Engine API routes."""

from fastapi import APIRouter, Depends, status
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai import (
    AICompetitorRequest,
    AIContentCalendarRequest,
    AIEngagementPredictRequest,
    AIImagePromptRequest,
    AIReplyRequest,
    AISEORequest,
    AITrendRequest,
    ContentRewriteRequest,
)
from app.services.expanded_ai_service import ExpandedAIService

router = APIRouter(prefix="/ai", tags=["AI Generation & Analytics Suite"])


@router.post("/content-rewrite", status_code=status.HTTP_200_OK, summary="AI Content Rewriter")
async def rewrite_content(payload: ContentRewriteRequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.rewrite_content(payload)


@router.post("/reply-generator", status_code=status.HTTP_200_OK, summary="AI Reply Generator")
async def generate_reply(payload: AIReplyRequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.generate_reply(payload)


@router.post("/content-calendar", status_code=status.HTTP_200_OK, summary="AI Content Calendar Planner")
async def generate_calendar(payload: AIContentCalendarRequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.generate_calendar(payload)


@router.post("/image-prompt", status_code=status.HTTP_200_OK, summary="AI DALL-E / Midjourney Prompt Generator")
async def generate_image_prompt(payload: AIImagePromptRequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.generate_image_prompt(payload)


@router.get("/best-time", status_code=status.HTTP_200_OK, summary="AI Best Time to Post")
async def best_time_to_post(platform: str = "Instagram", current_user: User = Depends(get_current_user)):
    return ExpandedAIService.predict_best_time(platform)


@router.post("/engagement-predict", status_code=status.HTTP_200_OK, summary="AI Engagement Predictor")
async def predict_engagement(payload: AIEngagementPredictRequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.predict_engagement(payload)


@router.post("/seo-optimize", status_code=status.HTTP_200_OK, summary="AI SEO & Hashtag Optimizer")
async def analyze_seo(payload: AISEORequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.analyze_seo(payload)


@router.post("/competitor-analysis", status_code=status.HTTP_200_OK, summary="AI Competitor Analysis")
async def analyze_competitor(payload: AICompetitorRequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.analyze_competitor(payload)


@router.post("/trend-detection", status_code=status.HTTP_200_OK, summary="AI Trend Detector")
async def detect_trends(payload: AITrendRequest, current_user: User = Depends(get_current_user)):
    return ExpandedAIService.detect_trends(payload)
