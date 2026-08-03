# app/services/social_account_service.py
"""Social Account service operating on workspace boundaries."""

import logging

from app.exceptions.custom import NotFoundException
from app.models.social_account import PlatformType
from app.repositories.social_account_repository import SocialAccountRepository
from app.schemas.pagination import PaginatedResponse, PaginationParams
from app.schemas.social_account import SocialAccountCreate, SocialAccountResponse
from app.utils.crypto import encrypt_token

logger = logging.getLogger(__name__)


class SocialAccountService:
    """Service managing social platform connections in workspaces."""

    def __init__(self, repository: SocialAccountRepository) -> None:
        self.account_repo = repository

    async def connect_account(
        self, workspace_id: int, user_id: int, data: SocialAccountCreate
    ) -> SocialAccountResponse:
        """Encrypt credentials and link social account to workspace."""
        encrypted_access = encrypt_token(data.access_token)
        encrypted_refresh = (
            encrypt_token(data.refresh_token) if data.refresh_token else None
        )

        account = await self.account_repo.create(
            user_id=user_id,
            workspace_id=workspace_id,
            platform=data.platform,
            account_name=data.account_name,
            account_handle=data.account_handle,
            external_account_id=data.external_account_id,
            encrypted_access_token=encrypted_access,
            encrypted_refresh_token=encrypted_refresh,
            token_expires_at=data.token_expires_at,
        )
        return SocialAccountResponse.model_validate(account)

    async def list_workspace_accounts(
        self,
        workspace_id: int,
        params: PaginationParams,
        platform: PlatformType | None = None,
    ) -> PaginatedResponse[SocialAccountResponse]:
        """Fetch workspace channels matching filters."""
        items, total = await self.account_repo.list_workspace_accounts(
            workspace_id=workspace_id, params=params, platform=platform
        )
        responses = [SocialAccountResponse.model_validate(item) for item in items]
        return PaginatedResponse.create(
            items=responses,
            total=total,
            page=params.page,
            page_size=params.page_size,
        )

    async def disconnect_account(
        self, workspace_id: int, account_id: int
    ) -> None:
        """Disconnect social channel."""
        account = await self.account_repo.get_by_workspace_and_id(
            account_id=account_id, workspace_id=workspace_id
        )
        if not account:
            raise NotFoundException("Social account not found in workspace.")

        await self.account_repo.soft_delete(account)