"""Initial Schema Migration

Revision ID: 2026_08_02_0001
Revises: 
Create Date: 2026-08-02 10:28:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '2026_08_02_0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Initial Schema creation handled dynamically via Base.metadata.create_all
    pass


def downgrade() -> None:
    pass
