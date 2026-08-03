# app/utils/storage.py
"""Storage utility supporting both local disk and async S3-compatible file storage."""

import logging
import os
import aiofiles
import aioboto3
from fastapi import UploadFile
from app.config import settings

logger = logging.getLogger(__name__)


class StorageService:
    """Storage handler for media uploads (Local or S3)."""

    def __init__(self) -> None:
        self.session = aioboto3.Session()

    async def upload_file(self, file: UploadFile, key: str) -> str:
        """Upload stream to local storage or S3 and return media URL."""
        if settings.STORAGE_TYPE == "local" or not settings.AWS_ACCESS_KEY_ID:
            upload_dir = os.path.dirname(os.path.join(settings.UPLOAD_DIR, key))
            os.makedirs(upload_dir, exist_ok=True)
            file_path = os.path.join(settings.UPLOAD_DIR, key)
            
            content = await file.read()
            async with aiofiles.open(file_path, "wb") as out_file:
                await out_file.write(content)
            
            return f"/uploads/{key}"

        client_kwargs = {
            "aws_access_key_id": settings.AWS_ACCESS_KEY_ID,
            "aws_secret_access_key": settings.AWS_SECRET_ACCESS_KEY,
            "region_name": settings.AWS_REGION,
        }
        if settings.S3_ENDPOINT_URL:
            client_kwargs["endpoint_url"] = settings.S3_ENDPOINT_URL

        async with self.session.client("s3", **client_kwargs) as s3:
            await s3.upload_fileobj(
                file.file,
                settings.S3_BUCKET_NAME,
                key,
                ExtraArgs={"ContentType": file.content_type},
            )

        if settings.S3_ENDPOINT_URL:
            return f"{settings.S3_ENDPOINT_URL}/{settings.S3_BUCKET_NAME}/{key}"
        return f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"