"""add resume_strategy_brief to job_applications

Revision ID: b2c9f4d1e3a7
Revises: 4b8144bd3605
Create Date: 2026-03-03 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "b2c9f4d1e3a7"
down_revision: Union[str, None] = "4b8144bd3605"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "job_applications",
        sa.Column("resume_strategy_brief", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        schema="app",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("job_applications", "resume_strategy_brief", schema="app")
