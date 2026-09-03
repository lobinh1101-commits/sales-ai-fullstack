"""initial schema"""
from alembic import op
from app.core.database import Base
import app.models  # noqa
revision="0001_initial";down_revision=None;branch_labels=None;depends_on=None

def upgrade():
    bind=op.get_bind()
    op.execute("CREATE SEQUENCE IF NOT EXISTS customer_code_seq START 1")
    op.execute("CREATE SEQUENCE IF NOT EXISTS invoice_code_seq START 1")
    op.execute("CREATE SEQUENCE IF NOT EXISTS purchase_code_seq START 1")
    Base.metadata.create_all(bind=bind)

def downgrade():
    bind=op.get_bind()
    Base.metadata.drop_all(bind=bind)
    op.execute("DROP SEQUENCE IF EXISTS customer_code_seq")
    op.execute("DROP SEQUENCE IF EXISTS invoice_code_seq")
    op.execute("DROP SEQUENCE IF EXISTS purchase_code_seq")
