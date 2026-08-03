# app/utils/storage.py
"""Async S3-compatible file storage utility using aioboto3."""

import logging

import aioboto3
from fastapi import UploadFile
from app.config import settings

logger = logging.getLogger(__name__)


class StorageService:
    """S3 storage handler for media uploads."""

    def __init__(self) -> None:
        self.session = aioboto3.Session()

    async def upload_file(self, file: UploadFile, key: str) -> str:
        """Upload stream to S3 and return public or signed media URL."""
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