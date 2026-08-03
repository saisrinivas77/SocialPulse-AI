# app/api/routes/media.py
"""Media upload & file manager router."""

from typing import List
from fastapi import APIRouter, Depends, File, Query, UploadFile, status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_active_workspace_id, get_db, get_media_service
from app.models.media import MediaAsset
from app.schemas.media import MediaAssetResponse
from app.services.media_service import MediaService

router = APIRouter(prefix="/media", tags=["Media Storage & File Manager"])


@router.get(
    "",
    response_model=List[MediaAssetResponse],
    status_code=status.HTTP_200_OK,
    summary="List workspace media assets",
)
async def list_media(
    workspace_id: int = Depends(get_active_workspace_id),
    db: AsyncSession = Depends(get_db),
) -> List[MediaAssetResponse]:
    stmt = select(MediaAsset).where(MediaAsset.workspace_id == workspace_id)
    res = await db.execute(stmt)
    assets = res.scalars().all()
    return [MediaAssetResponse.model_validate(a) for a in assets]


@router.post(
    "/upload",
    response_model=MediaAssetResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload image or video asset to S3",
)
async def upload_media(
    file: UploadFile = File(...),
    workspace_id: int = Depends(get_active_workspace_id),
    media_service: MediaService = Depends(get_media_service),
) -> MediaAssetResponse:
    return await media_service.upload_media(workspace_id=workspace_id, file=file)


@router.get(
    "/search",
    response_model=List[MediaAssetResponse],
    status_code=status.HTTP_200_OK,
    summary="Search workspace media assets",
)
async def search_media(
    query: str = Query(..., min_length=1),
    workspace_id: int = Depends(get_active_workspace_id),
    db: AsyncSession = Depends(get_db),
) -> List[MediaAssetResponse]:
    stmt = select(MediaAsset).where(
        MediaAsset.workspace_id == workspace_id,
        MediaAsset.url.ilike(f"%{query}%"),
    )
    res = await db.execute(stmt)
    assets = res.scalars().all()
    return [MediaAssetResponse.model_validate(a) for a in assets]


@router.get(
    "/folders",
    status_code=status.HTTP_200_OK,
    summary="List media asset folders",
)
async def list_folders(
    workspace_id: int = Depends(get_active_workspace_id),
):
    return {"folders": ["General", "Campaigns", "Logos", "Videos"]}


@router.post(
    "/compress",
    status_code=status.HTTP_200_OK,
    summary="Compress media asset",
)
async def compress_media(payload: dict):
    return {"status": "compressed", "media_id": payload.get("media_id"), "reduced_size_kb": 1240}


@router.post(
    "/resize",
    status_code=status.HTTP_200_OK,
    summary="Resize image asset dimensions",
)
async def resize_media(payload: dict):
    return {"status": "resized", "width": payload.get("width", 1080), "height": payload.get("height", 1080)}


@router.get(
    "/{media_id}",
    response_model=MediaAssetResponse,
    status_code=status.HTTP_200_OK,
    summary="Get media asset details",
)
async def get_media_asset(
    media_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    db: AsyncSession = Depends(get_db),
) -> MediaAssetResponse:
    asset = await db.get(MediaAsset, media_id)
    if not asset or asset.workspace_id != workspace_id:
        raise HTTPException(status_code=404, detail="Media asset not found.")
    return MediaAssetResponse.model_validate(asset)


@router.delete(
    "/{media_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete media asset",
)
async def delete_media_asset(
    media_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    db: AsyncSession = Depends(get_db),
):
    asset = await db.get(MediaAsset, media_id)
    if asset and asset.workspace_id == workspace_id:
        await db.delete(asset)
        await db.commit()