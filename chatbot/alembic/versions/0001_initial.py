"""initial

Revision ID: 0001
Revises: 
Create Date: 2025-09-06
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # NOTE: This is a placeholder. Run `alembic revision --autogenerate -m "init"` to
    # generate a migration based on models.
    pass


def downgrade():
    pass
