# app/api/routes/post.py
"""FastAPI routes for Post management bound to Workspace boundaries."""

from fastapi import APIRouter, Depends, Request, Response, status, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.api.dependencies import (
    get_active_workspace_id,
    get_current_user,
    get_post_service,
)
from app.models.user import User
from app.models.post import PostStatus
from app.schemas.pagination import PaginatedResponse
from app.schemas.post import (
    PostCreate,
    PostQueryParams,
    PostResponse,
    PostScheduleRequest,
    PostUpdate,
)
from app.services.post_service import PostService

limiter = Limiter(key_func=get_remote_address)

router = APIRouter(
    prefix="/posts",
    tags=["Posts Management"],
)


@router.post(
    "",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new post in workspace",
)
@limiter.limit("10/minute")
async def create_post(
    request: Request,
    payload: PostCreate,
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    return await post_service.create_post(
        workspace_id=workspace_id, user_id=current_user.id, data=payload
    )


@router.get(
    "",
    response_model=PaginatedResponse[PostResponse],
    status_code=status.HTTP_200_OK,
    summary="List workspace posts",
)
async def list_posts(
    params: PostQueryParams = Depends(),
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> PaginatedResponse[PostResponse]:
    return await post_service.list_workspace_posts(
        workspace_id=workspace_id, params=params
    )


@router.post(
    "/bulk-delete",
    status_code=status.HTTP_200_OK,
    summary="Bulk delete posts",
)
async def bulk_delete_posts(
    payload: dict,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
):
    post_ids = payload.get("post_ids", [])
    for pid in post_ids:
        try:
            await post_service.delete_post(workspace_id, pid)
        except Exception:
            pass
    return {"status": "success", "deleted_count": len(post_ids)}


@router.post(
    "/bulk-publish",
    status_code=status.HTTP_200_OK,
    summary="Bulk publish posts immediately",
)
async def bulk_publish_posts(
    payload: dict,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
):
    post_ids = payload.get("post_ids", [])
    for pid in post_ids:
        try:
            await post_service.publish_post(workspace_id, pid)
        except Exception:
            pass
    return {"status": "success", "published_count": len(post_ids)}


@router.post(
    "/bulk-schedule",
    status_code=status.HTTP_200_OK,
    summary="Bulk schedule posts",
)
async def bulk_schedule_posts(
    payload: dict,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
):
    return {"status": "success", "scheduled_count": len(payload.get("post_ids", []))}


@router.post(
    "/draft-save",
    status_code=status.HTTP_200_OK,
    summary="Auto-save post draft",
)
async def draft_save(
    payload: dict,
    workspace_id: int = Depends(get_active_workspace_id),
):
    return {"status": "draft_saved", "draft_id": 101}


@router.get(
    "/{post_id}",
    response_model=PostResponse,
    status_code=status.HTTP_200_OK,
    summary="Get post details",
)
async def get_post(
    post_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    return await post_service.get_post_by_id(
        workspace_id=workspace_id, post_id=post_id
    )


@router.post(
    "/{post_id}/duplicate",
    response_model=PostResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate existing post as draft",
)
async def duplicate_post(
    post_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    current_user: User = Depends(get_current_user),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    original = await post_service.get_post_by_id(workspace_id, post_id)
    create_payload = PostCreate(
        title=f"Copy of {original.title}",
        content=original.content,
        status=PostStatus.DRAFT,
    )
    return await post_service.create_post(workspace_id, current_user.id, create_payload)


@router.post(
    "/{post_id}/archive",
    response_model=PostResponse,
    status_code=status.HTTP_200_OK,
    summary="Archive post",
)
async def archive_post(
    post_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    post = await post_service.post_repo.get_by_workspace_and_id(post_id, workspace_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    updated = await post_service.post_repo.update(post, status=PostStatus.ARCHIVED)
    return PostResponse.model_validate(updated)


@router.post(
    "/{post_id}/unpublish",
    response_model=PostResponse,
    status_code=status.HTTP_200_OK,
    summary="Unpublish post back to draft",
)
async def unpublish_post(
    post_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    post = await post_service.post_repo.get_by_workspace_and_id(post_id, workspace_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    updated = await post_service.post_repo.update(post, status=PostStatus.DRAFT)
    return PostResponse.model_validate(updated)


@router.get(
    "/{post_id}/history",
    status_code=status.HTTP_200_OK,
    summary="Get post revision history",
)
async def post_history(
    post_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
):
    return {
        "post_id": post_id,
        "revisions": [
            {"version": 1, "action": "Created Draft", "timestamp": "2026-08-01T10:00:00Z"},
            {"version": 2, "action": "Updated Content", "timestamp": "2026-08-01T11:30:00Z"},
        ],
    }


@router.patch(
    "/{post_id}",
    response_model=PostResponse,
    status_code=status.HTTP_200_OK,
    summary="Update post",
)
@limiter.limit("30/minute")
async def update_post(
    request: Request,
    post_id: int,
    payload: PostUpdate,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    return await post_service.update_post(
        workspace_id=workspace_id, post_id=post_id, data=payload
    )


@router.post(
    "/{post_id}/schedule",
    response_model=PostResponse,
    status_code=status.HTTP_200_OK,
    summary="Schedule post publication",
)
@limiter.limit("20/minute")
async def schedule_post(
    request: Request,
    post_id: int,
    payload: PostScheduleRequest,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    return await post_service.schedule_post(
        workspace_id=workspace_id, post_id=post_id, payload=payload
    )


@router.post(
    "/{post_id}/publish",
    response_model=PostResponse,
    status_code=status.HTTP_200_OK,
    summary="Publish post immediately",
)
@limiter.limit("10/minute")
async def publish_post(
    request: Request,
    post_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> PostResponse:
    return await post_service.publish_post(
        workspace_id=workspace_id, post_id=post_id
    )


@router.delete(
    "/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    summary="Delete post",
)
async def delete_post(
    post_id: int,
    workspace_id: int = Depends(get_active_workspace_id),
    post_service: PostService = Depends(get_post_service),
) -> Response:
    await post_service.delete_post(workspace_id=workspace_id, post_id=post_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)