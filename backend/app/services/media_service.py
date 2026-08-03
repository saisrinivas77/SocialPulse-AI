# app/services/media_service.py
"""Service handling file uploads to S3 storage."""

import uuid
from fastapi import UploadFile

from app.exceptions.custom import ValidationException
from app.models.media import MediaType
from app.repositories.media_repository import MediaRepository
from app.schemas.media import MediaAssetResponse
from app.utils.storage import StorageService


class MediaService:
    """Service validating and uploading files to S3."""

    ALLOWED_MIME_TYPES = {
        "image/jpeg": MediaType.IMAGE,
        "image/png": MediaType.IMAGE,
        "image/webp": MediaType.IMAGE,
        "video/mp4": MediaType.VIDEO,
        "video/quicktime": MediaType.VIDEO,
    }

    def __init__(self, media_repo: MediaRepository) -> None:
        self.media_repo = media_repo
        self.storage = StorageService()

    async def upload_media(
        self, workspace_id: int, file: UploadFile
    ) -> MediaAssetResponse:
        """Validate, store in S3, and record media asset metadata."""
        if file.content_type not in self.ALLOWED_MIME_TYPES:
            raise ValidationException(f"Unsupported content-type: {file.content_type}")

        media_type = self.ALLOWED_MIME_TYPES[file.content_type]
        extension = file.filename.split(".")[-1] if file.filename and "." in file.filename else "bin"
        s3_key = f"workspaces/{workspace_id}/{uuid.uuid4()}.{extension}"

        url = await self.storage.upload_file(file, s3_key)
        file.file.seek(0, 2)
        file_size = file.file.tell()

        media = await self.media_repo.create(
            workspace_id=workspace_id,
            media_type=media_type,
            url=url,
            mime_type=file.content_type,
            file_size_bytes=file_size,
        )
        return MediaAssetResponse.model_validate(media)