# app/api/routes/workspaces.py
"""Workspace management router."""

from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember, WorkspaceRole
from app.schemas.workspace import WorkspaceResponse, WorkspaceMemberResponse

router = APIRouter(prefix="/workspaces", tags=["Workspaces"])


@router.get(
    "",
    response_model=List[WorkspaceResponse],
    status_code=status.HTTP_200_OK,
    summary="List tenant user workspaces",
)
async def list_user_workspaces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[WorkspaceResponse]:
    """Retrieve all workspaces where user holds membership."""
    stmt = (
        select(Workspace)
        .join(WorkspaceMember)
        .where(WorkspaceMember.user_id == current_user.id)
    )
    result = await db.execute(stmt)
    workspaces = result.scalars().all()
    return [WorkspaceResponse.model_validate(ws) for ws in workspaces]


@router.post(
    "",
    response_model=WorkspaceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create workspace",
)
async def create_workspace(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> WorkspaceResponse:
    name = payload.get("name", f"{current_user.first_name}'s Workspace")
    workspace = Workspace(organization_id=1, name=name)
    db.add(workspace)
    await db.flush()

    member = WorkspaceMember(
        workspace_id=workspace.id, user_id=current_user.id, role=WorkspaceRole.OWNER
    )
    db.add(member)
    await db.commit()
    await db.refresh(workspace)
    return WorkspaceResponse.model_validate(workspace)


@router.get(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
    status_code=status.HTTP_200_OK,
    summary="Get workspace details",
)
async def get_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> WorkspaceResponse:
    ws = await db.get(Workspace, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    return WorkspaceResponse.model_validate(ws)


@router.patch(
    "/{workspace_id}",
    response_model=WorkspaceResponse,
    status_code=status.HTTP_200_OK,
    summary="Update workspace",
)
async def update_workspace(
    workspace_id: int,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> WorkspaceResponse:
    ws = await db.get(Workspace, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found.")
    if "name" in payload:
        ws.name = payload["name"]
    await db.commit()
    await db.refresh(ws)
    return WorkspaceResponse.model_validate(ws)


@router.delete(
    "/{workspace_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete workspace",
)
async def delete_workspace(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    ws = await db.get(Workspace, workspace_id)
    if ws:
        await db.delete(ws)
        await db.commit()


@router.get(
    "/{workspace_id}/members",
    response_model=List[WorkspaceMemberResponse],
    status_code=status.HTTP_200_OK,
    summary="List workspace members",
)
async def list_workspace_members(
    workspace_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[WorkspaceMemberResponse]:
    stmt = select(WorkspaceMember).where(WorkspaceMember.workspace_id == workspace_id)
    res = await db.execute(stmt)
    members = res.scalars().all()
    return [WorkspaceMemberResponse.model_validate(m) for m in members]


@router.post(
    "/{workspace_id}/members",
    response_model=WorkspaceMemberResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add workspace member",
)
async def add_workspace_member(
    workspace_id: int,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> WorkspaceMemberResponse:
    user_id = payload.get("user_id", current_user.id)
    role = payload.get("role", WorkspaceRole.MEMBER)
    member = WorkspaceMember(workspace_id=workspace_id, user_id=user_id, role=role)
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return WorkspaceMemberResponse.model_validate(member)


@router.delete(
    "/{workspace_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove workspace member",
)
async def remove_workspace_member(
    workspace_id: int,
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(WorkspaceMember).where(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id,
    )
    res = await db.execute(stmt)
    member = res.scalars().first()
    if member:
        await db.delete(member)
        await db.commit()


@router.put(
    "/{workspace_id}/roles",
    status_code=status.HTTP_200_OK,
    summary="Update workspace member role",
)
async def update_member_role(
    workspace_id: int,
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_id = payload.get("user_id")
    new_role = payload.get("role", WorkspaceRole.MEMBER)
    stmt = select(WorkspaceMember).where(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id,
    )
    res = await db.execute(stmt)
    member = res.scalars().first()
    if member:
        member.role = new_role
        await db.commit()
    return {"status": "role updated", "user_id": user_id, "role": new_role}