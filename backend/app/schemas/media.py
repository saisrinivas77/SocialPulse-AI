# app/schemas/media.py
"""Media schemas."""

from pydantic import BaseModel, ConfigDict
from app.models.media import MediaType


class MediaAssetResponse(BaseModel):
    """Response schema for uploaded media asset."""

    id: int
    workspace_id: int
    media_type: MediaType
    url: str
    mime_type: str
    file_size_bytes: int

    model_config = ConfigDict(from_attributes=True)