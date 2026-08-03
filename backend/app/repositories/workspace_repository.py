# app/repositories/workspace_repository.py
"""Workspace and WorkspaceMember RBAC repository."""

from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.workspace import Organization, Workspace, WorkspaceMember, WorkspaceRole
from app.repositories.base import BaseRepository


class WorkspaceRepository(BaseRepository[Workspace]):
    """Data operations for workspaces and member permissions."""

    def __init__(self, session: AsyncSession) -> None:
        super().__init__(Workspace, session)

    async def create_workspace_with_org(
        self, user_id: Any, org_name: str, workspace_name: str
    ) -> Workspace:
        """Create Organization, Workspace, and assign user as OWNER."""
        org = Organization(name=org_name)
        self.session.add(org)
        await self.session.flush()

        workspace = Workspace(organization_id=org.id, name=workspace_name)
        self.session.add(workspace)
        await self.session.flush()

        member = WorkspaceMember(
            workspace_id=workspace.id, user_id=user_id, role=WorkspaceRole.OWNER
        )
        self.session.add(member)
        await self.session.flush()

        return workspace

    async def get_membership(
        self, workspace_id: Any, user_id: Any
    ) -> Optional[WorkspaceMember]:
        """Fetch workspace membership details for authorization checks."""
        stmt = select(WorkspaceMember).where(
            WorkspaceMember.workspace_id == workspace_id,
            WorkspaceMember.user_id == user_id,
        )
        result = await self.session.execute(stmt)
        return result.scalars().first()