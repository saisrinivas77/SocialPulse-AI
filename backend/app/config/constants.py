"""
Global constants for SocialPulse AI
"""

# ==========================================================
# API
# ==========================================================

API_PREFIX = "/api/v1"

API_VERSION = "v1"

# ==========================================================
# USER ROLES
# ==========================================================

ROLE_ADMIN = "admin"

ROLE_USER = "user"

ROLE_MANAGER = "manager"

USER_ROLES = (
    ROLE_ADMIN,
    ROLE_MANAGER,
    ROLE_USER,
)

# ==========================================================
# ACCOUNT STATUS
# ==========================================================

STATUS_ACTIVE = "active"

STATUS_INACTIVE = "inactive"

STATUS_BLOCKED = "blocked"

STATUS_PENDING = "pending"

ACCOUNT_STATUS = (
    STATUS_ACTIVE,
    STATUS_INACTIVE,
    STATUS_BLOCKED,
    STATUS_PENDING,
)

# ==========================================================
# SOCIAL MEDIA PLATFORMS
# ==========================================================

INSTAGRAM = "instagram"

FACEBOOK = "facebook"

TWITTER = "twitter"

LINKEDIN = "linkedin"

YOUTUBE = "youtube"

SOCIAL_PLATFORMS = (
    INSTAGRAM,
    FACEBOOK,
    TWITTER,
    LINKEDIN,
    YOUTUBE,
)

# ==========================================================
# SENTIMENT LABELS
# ==========================================================

POSITIVE = "positive"

NEGATIVE = "negative"

NEUTRAL = "neutral"

SENTIMENTS = (
    POSITIVE,
    NEGATIVE,
    NEUTRAL,
)

# ==========================================================
# PAGINATION
# ==========================================================

DEFAULT_PAGE = 1

DEFAULT_PAGE_SIZE = 10

MAX_PAGE_SIZE = 100

# ==========================================================
# FILE UPLOADS
# ==========================================================

ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
}

ALLOWED_DOCUMENT_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".xlsx",
}

MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024

MAX_POST_IMAGE_SIZE = 10 * 1024 * 1024

# ==========================================================
# JWT TOKEN TYPES
# ==========================================================

ACCESS_TOKEN = "access"

REFRESH_TOKEN = "refresh"

# ==========================================================
# CACHE KEYS
# ==========================================================

USER_CACHE = "user"

ANALYTICS_CACHE = "analytics"

DASHBOARD_CACHE = "dashboard"

# ==========================================================
# AI MODELS
# ==========================================================

DEFAULT_SENTIMENT_MODEL = (
    "cardiffnlp/twitter-roberta-base-sentiment"
)

DEFAULT_CAPTION_MODEL = "gpt-4.1-mini"

DEFAULT_HASHTAG_MODEL = "gpt-4.1-mini"

# ==========================================================
# ANALYTICS
# ==========================================================

ENGAGEMENT_METRICS = (
    "likes",
    "comments",
    "shares",
    "followers",
    "reach",
    "impressions",
)

# ==========================================================
# DEFAULT HTTP RESPONSES
# ==========================================================

SUCCESS = "Success"

CREATED = "Created Successfully"

UPDATED = "Updated Successfully"

DELETED = "Deleted Successfully"

NOT_FOUND = "Resource Not Found"

UNAUTHORIZED = "Unauthorized"

FORBIDDEN = "Forbidden"

BAD_REQUEST = "Bad Request"

SERVER_ERROR = "Internal Server Error"

# ==========================================================
# DATE FORMATS
# ==========================================================

DATE_FORMAT = "%Y-%m-%d"

DATETIME_FORMAT = "%Y-%m-%d %H:%M:%S"

# ==========================================================
# DEFAULT TIMEZONE
# ==========================================================

TIMEZONE = "Asia/Kolkata"