# app/schemas/workspace.py
"""Workspace and Organization schemas."""

from pydantic import BaseModel, ConfigDict
from app.models.workspace import WorkspaceRole


class WorkspaceResponse(BaseModel):
    """Workspace details schema."""

    id: int
    organization_id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class WorkspaceMemberResponse(BaseModel):
    """Workspace membership model."""

    workspace_id: int
    user_id: int
    role: WorkspaceRole

    model_config = ConfigDict(from_attributes=True)