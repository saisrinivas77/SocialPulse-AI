import logging
import logging.handlers
from pathlib import Path

from app.config.settings import settings


# ==========================================================
# Create Log Directory
# ==========================================================

log_file = Path(settings.LOG_FILE)

log_file.parent.mkdir(
    parents=True,
    exist_ok=True,
)


# ==========================================================
# Log Format
# ==========================================================

LOG_FORMAT = (
    "%(asctime)s | "
    "%(levelname)-8s | "
    "%(name)s | "
    "%(filename)s:%(lineno)d | "
    "%(message)s"
)

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


# ==========================================================
# Logger
# ==========================================================


def setup_logging() -> logging.Logger:
    """
    Configure application logging.
    """

    logger = logging.getLogger("SocialPulseAI")

    if logger.handlers:
        return logger

    logger.setLevel(settings.LOG_LEVEL)

    formatter = logging.Formatter(
        LOG_FORMAT,
        datefmt=DATE_FORMAT,
    )

    # -----------------------------
    # Console Handler
    # -----------------------------

    console_handler = logging.StreamHandler()

    console_handler.setFormatter(formatter)

    logger.addHandler(console_handler)

    # -----------------------------
    # Rotating File Handler
    # -----------------------------

    file_handler = logging.handlers.RotatingFileHandler(
        filename=settings.LOG_FILE,
        maxBytes=10 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )

    file_handler.setFormatter(formatter)

    logger.addHandler(file_handler)

    logger.propagate = False

    logger.info("Logging initialized successfully.")

    return logger


logger = setup_logging()