from logging.config import fileConfig
import os

from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from alembic import context

# Load environment variables
load_dotenv()

# Alembic Config object
config = context.config

# Set database URL from .env
database_url = os.getenv("DATABASE_URL").replace("%", "%%")

config.set_main_option(
    "sqlalchemy.url",
    database_url,
)

# Configure logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import Base and all models
from app.db.database import Base

from app.db.database import Base

import app.models.user
import app.models.employee
import app.models.department
import app.models.attendance
import app.models.leave
import app.models.document
import app.models.chat_history
import app.models.audit_log
# Metadata for autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:

        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()