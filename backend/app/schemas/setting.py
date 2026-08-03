# app/schemas/setting.py
"""Pydantic schemas for System & Workspace Settings."""

from typing import Dict, Any
from pydantic import BaseModel, ConfigDict


class SettingUpdate(BaseModel):
    """Payload to update setting key-values."""

    category: str = "general"
    settings: Dict[str, Any]


class SettingResponse(BaseModel):
    """Setting item response."""

    id: int
    category: str
    key: str
    value: str

    model_config = ConfigDict(from_attributes=True)
