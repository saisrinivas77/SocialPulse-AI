# app/services/report_service.py
"""Report Service."""

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.report_repository import ReportRepository
from app.schemas.report import ReportGenerateRequest, ReportResponse


class ReportService:
    def __init__(self, session: AsyncSession):
        self.repo = ReportRepository(session)

    async def generate_report(self, user_id: int, payload: ReportGenerateRequest):
        file_path = f"exports/reports/{user_id}_{payload.report_type}.{payload.format}"
        report = await self.repo.create(
            user_id=user_id,
            title=payload.title,
            report_type=payload.report_type,
            format=payload.format,
            file_path=file_path,
            status="completed",
        )
        return ReportResponse.model_validate(report)

    async def list_user_reports(self, user_id: int):
        reports = await self.repo.get_user_reports(user_id)
        return [ReportResponse.model_validate(r) for r in reports]
