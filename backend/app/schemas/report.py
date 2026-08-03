# app/schemas/report.py
"""Pydantic schemas for Reports."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class ReportGenerateRequest(BaseModel):
    """Payload to request an async report export."""

    title: str = Field(..., min_length=1)
    report_type: str = Field(..., description="Type of report: analytics, posts, summary")
    format: str = Field(default="pdf", description="pdf, csv, excel, json")


class ReportResponse(BaseModel):
    """Report item response."""

    id: int
    title: str
    report_type: str
    format: str
    file_path: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
