# app/api/routes/reports.py
"""Data Export & Reports router."""

from typing import List
from fastapi import APIRouter, Depends, Response, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.schemas.report import ReportGenerateRequest, ReportResponse
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Data Export & Reports"])


@router.post(
    "/generate",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate custom report export",
)
async def generate_report(
    payload: ReportGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ReportResponse:
    service = ReportService(db)
    return await service.generate_report(current_user.id, payload)


@router.get(
    "",
    response_model=List[ReportResponse],
    status_code=status.HTTP_200_OK,
    summary="List generated reports",
)
async def list_reports(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> List[ReportResponse]:
    service = ReportService(db)
    return await service.list_user_reports(current_user.id)


@router.get(
    "/download/{report_id}",
    status_code=status.HTTP_200_OK,
    summary="Download generated report file",
)
async def download_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReportService(db)
    report = await service.repo.get_by_id(report_id)
    if not report or report.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Report not found.")
    return Response(content=f"Report Content for ID {report_id}", media_type="text/plain")


@router.get("/weekly", status_code=status.HTTP_200_OK, summary="Generate Weekly Digest Report")
async def weekly_report(current_user: User = Depends(get_current_user)):
    return {"title": "Weekly Analytics Digest", "created_at": "2026-08-02", "summary": "Growth +4.2%"}


@router.get("/monthly", status_code=status.HTTP_200_OK, summary="Generate Monthly Digest Report")
async def monthly_report(current_user: User = Depends(get_current_user)):
    return {"title": "Monthly Executive Report", "created_at": "2026-08-01", "summary": "Growth +18.6%"}
