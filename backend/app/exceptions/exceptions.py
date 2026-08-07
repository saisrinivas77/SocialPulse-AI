"""Custom application exceptions."""


class AppException(Exception):
    """Base application exception."""

    def __init__(self, message: str = "Application error", detail: str | None = None):
        self.message = detail if detail is not None else message
        self.detail = self.message
        super().__init__(self.message)


class NotFoundException(AppException):
    """Raised when a resource is not found."""

    def __init__(self, message: str = "Resource not found", detail: str | None = None):
        super().__init__(message=message, detail=detail)


class UnauthorizedException(AppException):
    """Raised when authentication or authorization fails."""

    def __init__(self, message: str = "Unauthorized", detail: str | None = None):
        super().__init__(message=message, detail=detail)


class ValidationException(AppException):
    """Raised when validation fails."""

    def __init__(self, message: str = "Validation failed", detail: str | None = None):
        super().__init__(message=message, detail=detail)


class ConflictException(AppException):
    """Raised when a resource already exists."""

    def __init__(self, message: str = "Conflict", detail: str | None = None):
        super().__init__(message=message, detail=detail)


class ForbiddenException(AppException):
    """Raised when access is forbidden."""

    def __init__(self, message: str = "Forbidden", detail: str | None = None):
        super().__init__(message=message, detail=detail)


class OAuthException(AppException):
    """Raised during OAuth code exchange, profile fetch, or database save."""

    def __init__(self, provider: str, step: str, message: str, detail: str | None = None):
        self.provider = provider
        self.step = step
        super().__init__(message=message, detail=detail)


ServiceException = AppException