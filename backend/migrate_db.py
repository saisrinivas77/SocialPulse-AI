import asyncio
from sqlalchemy import text
from app.database import engine

async def run_migration():
    async with engine.begin() as conn:
        user_cols = [
            ("avatar_url", "VARCHAR(500) NULL"),
            ("provider", "VARCHAR(50) NOT NULL DEFAULT 'email'"),
            ("provider_user_id", "VARCHAR(255) NULL"),
            ("is_verified", "TINYINT(1) NOT NULL DEFAULT 1"),
            ("verification_token", "VARCHAR(255) NULL"),
            ("verification_token_expires_at", "DATETIME NULL"),
            ("reset_password_token", "VARCHAR(255) NULL"),
            ("reset_password_token_expires_at", "DATETIME NULL"),
            ("last_login", "DATETIME NULL"),
        ]
        for col, col_type in user_cols:
            try:
                await conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {col_type}"))
                print(f"Added column {col} to users table")
            except Exception as e:
                print(f"Column {col} status: {e}")

        social_cols = [
            ("follower_count", "INT NOT NULL DEFAULT 0"),
            ("reach_count", "INT NOT NULL DEFAULT 0"),
            ("posts_count", "INT NOT NULL DEFAULT 0"),
            ("engagement_rate", "FLOAT NOT NULL DEFAULT 0.0"),
            ("avatar_url", "VARCHAR(500) NULL"),
            ("sync_health", "FLOAT NOT NULL DEFAULT 100.0"),
            ("status", "VARCHAR(50) NOT NULL DEFAULT 'active'"),
            ("last_synced_at", "DATETIME NULL"),
        ]
        for col, col_type in social_cols:
            try:
                await conn.execute(text(f"ALTER TABLE social_accounts ADD COLUMN {col} {col_type}"))
                print(f"Added column {col} to social_accounts table")
            except Exception as e:
                print(f"Column {col} status: {e}")

if __name__ == "__main__":
    asyncio.run(run_migration())
