# app/middleware/request_id.py
"""ASGI middleware propagating request IDs across logs and response headers."""

import time
import uuid
import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

HEADER_REQUEST_ID = "X-Request-ID"


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Injects unique X-Request-ID headers into request state and context logging."""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        start_time = time.perf_counter()
        request_id = request.headers.get(HEADER_REQUEST_ID, str(uuid.uuid4()))
        request.state.request_id = request_id

        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            path=request.url.path,
            method=request.method,
        )

        response = await call_next(request)
        process_time = time.perf_counter() - start_time

        response.headers[HEADER_REQUEST_ID] = request_id
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        return response