# app/services/workspace_service.py
"""Service managing tenant workspaces and member permissions."""

from app.exceptions.custom import ForbiddenException
from app.models.workspace import WorkspaceRole
from app.repositories.workspace_repository import WorkspaceRepository


class WorkspaceService:
    """Service handling multi-tenant Workspace validation rules."""

    def __init__(self, workspace_repo: WorkspaceRepository) -> None:
        self.workspace_repo = workspace_repo

    async def verify_member_access(
        self,
        workspace_id: int,
        user_id: int,
        required_role: WorkspaceRole = WorkspaceRole.MEMBER,
    ) -> None:
        """Assert user holds membership in workspace meeting required RBAC role."""
        membership = await self.workspace_repo.get_membership(
            workspace_id=workspace_id, user_id=user_id
        )
        if not membership:
            raise ForbiddenException("User is not a member of this workspace.")

        role_hierarchy = {
            WorkspaceRole.MEMBER: 1,
            WorkspaceRole.ADMIN: 2,
            WorkspaceRole.OWNER: 3,
        }

        if role_hierarchy[membership.role] < role_hierarchy[required_role]:
            raise ForbiddenException(
                f"Insufficient workspace permissions. Required: {required_role.value}"
            )