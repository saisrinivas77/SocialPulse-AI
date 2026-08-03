# app/repositories/report_repository.py
"""Report Repository."""

from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.report import Report
from app.repositories.base import BaseRepository


class ReportRepository(BaseRepository[Report]):
    def __init__(self, session: AsyncSession):
        super().__init__(Report, session)

    async def get_user_reports(self, user_id: int) -> Sequence[Report]:
        stmt = select(Report).where(Report.user_id == user_id).order_by(Report.created_at.desc())
        res = await self.session.execute(stmt)
        return res.scalars().all()
