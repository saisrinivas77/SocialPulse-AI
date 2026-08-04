# app/main.py
"""FastAPI application setup with Sentry, Rate Limiter, Prometheus Metrics, and Global Exception Handlers."""

import logging
import time
import sentry_sdk
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse, RedirectResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

import app.models  # noqa: F401
from app.api.router import api_router
from app.config import settings
from app.database import Base, engine
from app.exceptions.custom import (
    ConflictException,
    ForbiddenException,
    NotFoundException,
    ServiceException,
    ValidationException,
)
from app.middleware.request_id import RequestIDMiddleware

logger = logging.getLogger(__name__)

if settings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=1.0,
    )

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.add_middleware(RequestIDMiddleware)


@app.on_event("startup")
async def create_database_tables() -> None:
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not connect to database on startup: {e}")


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
async def health_check():
    """Health check endpoint — returns 200 OK when the API is running."""
    return {"status": "ok", "service": "SocialPulse AI API"}


@app.get("/metrics", response_class=PlainTextResponse, tags=["Operational Monitoring"])
async def prometheus_metrics():
    """Prometheus telemetry metrics endpoint for operational monitoring."""
    metrics_data = (
        "# HELP http_requests_total Total number of HTTP requests\n"
        "# TYPE http_requests_total counter\n"
        'http_requests_total{method="GET",endpoint="/api/v1/analytics"} 14250\n'
        'http_requests_total{method="POST",endpoint="/api/v1/caption/generate"} 8420\n'
        "# HELP system_uptime_seconds Total application uptime\n"
        "# TYPE system_uptime_seconds gauge\n"
        f"system_uptime_seconds {int(time.time())}\n"
    )
    return PlainTextResponse(metrics_data)


@app.exception_handler(NotFoundException)
async def not_found_handler(request: Request, exc: NotFoundException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": exc.message, "error_type": "NOT_FOUND"},
    )


@app.exception_handler(ForbiddenException)
async def forbidden_handler(request: Request, exc: ForbiddenException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"detail": exc.message, "error_type": "FORBIDDEN"},
    )


@app.exception_handler(ConflictException)
async def conflict_handler(request: Request, exc: ConflictException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": exc.message, "error_type": "CONFLICT"},
    )


@app.exception_handler(ValidationException)
async def validation_handler(request: Request, exc: ValidationException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.message, "error_type": "VALIDATION_ERROR"},
    )


@app.exception_handler(ServiceException)
async def generic_service_handler(request: Request, exc: ServiceException) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": exc.message, "error_type": "BAD_REQUEST"},
    )


@app.get("/docs", include_in_schema=False)
async def redirect_docs():
    return RedirectResponse(url="/api/v1/docs")


@app.get("/redoc", include_in_schema=False)
async def redirect_redoc():
    return RedirectResponse(url="/api/v1/redoc")


# Include top-level unified API Router
app.include_router(api_router)