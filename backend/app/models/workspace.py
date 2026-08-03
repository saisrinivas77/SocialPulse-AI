# app/models/workspace.py
"""Multi-tenant Organization, Workspace, and WorkspaceMember RBAC models."""

import enum
from typing import TYPE_CHECKING, List

from sqlalchemy import Enum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.media import MediaAsset
    from app.models.post import Post
    from app.models.social_account import SocialAccount
    from app.models.user import User


class WorkspaceRole(str, enum.Enum):
    """RBAC permissions within a workspace."""

    OWNER = "OWNER"
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"


class Organization(Base):
    """Multi-tenant organization grouping workspaces."""

    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    workspaces: Mapped[List["Workspace"]] = relationship(
        "Workspace", back_populates="organization", cascade="all, delete-orphan"
    )


class Workspace(Base):
    """Tenant workspace defining resource isolation boundaries."""

    __tablename__ = "workspaces"

    organization_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    organization: Mapped["Organization"] = relationship(
        "Organization", back_populates="workspaces"
    )
    members: Mapped[List["WorkspaceMember"]] = relationship(
        "WorkspaceMember", back_populates="workspace", cascade="all, delete-orphan"
    )
    social_accounts: Mapped[List["SocialAccount"]] = relationship(
        "SocialAccount", back_populates="workspace", cascade="all, delete-orphan"
    )
    posts: Mapped[List["Post"]] = relationship(
        "Post", back_populates="workspace", cascade="all, delete-orphan"
    )
    media_assets: Mapped[List["MediaAsset"]] = relationship(
        "MediaAsset", back_populates="workspace", cascade="all, delete-orphan"
    )


class WorkspaceMember(Base):
    """Junction entity assigning users to workspaces with RBAC roles."""

    __tablename__ = "workspace_members"

    workspace_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    role: Mapped[WorkspaceRole] = mapped_column(
        Enum(WorkspaceRole, name="workspace_role_enum"),
        default=WorkspaceRole.MEMBER,
        nullable=False,
    )

    workspace: Mapped["Workspace"] = relationship(
        "Workspace", back_populates="members"
    )
    user: Mapped["User"] = relationship(
        "User", back_populates="workspace_memberships"
    )