# app/schemas/ai.py
"""Pydantic schemas for expanded AI tools."""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ContentRewriteRequest(BaseModel):
    content: str = Field(..., min_length=1)
    tone: str = Field(default="professional", description="casual, professional, catchy, witty")
    target_length: str = Field(default="medium", description="short, medium, long")


class AIReplyRequest(BaseModel):
    comment: str = Field(..., min_length=1)
    tone: str = Field(default="friendly")


class AIContentCalendarRequest(BaseModel):
    niche: str = Field(..., min_length=1)
    days: int = Field(default=7, ge=1, le=30)


class AIImagePromptRequest(BaseModel):
    topic: str = Field(..., min_length=1)
    style: str = Field(default="photorealistic", description="photorealistic, 3d-render, minimalist, digital-art")


class AIBestTimeRequest(BaseModel):
    platform: str = Field(..., min_length=1)


class AIEngagementPredictRequest(BaseModel):
    caption: str = Field(..., min_length=1)
    has_media: bool = Field(default=False)
    platform: str = Field(default="Instagram")


class AISEORequest(BaseModel):
    text: str = Field(..., min_length=1)


class AICompetitorRequest(BaseModel):
    competitor_handle: str = Field(..., min_length=1)
    platform: str = Field(default="Instagram")


class AITrendRequest(BaseModel):
    niche: str = Field(..., min_length=1)


class AIResponse(BaseModel):
    success: bool = True
    result: Dict[str, Any]
