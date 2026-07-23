"""
app/db/database.py

SQLAlchemy database setup for the Enterprise AI Assistant backend.

Provides:
    - engine: the SQLAlchemy Engine bound to the PostgreSQL DATABASE_URL
    - SessionLocal: a session factory for creating new DB sessions
    - Base: the declarative base class all ORM models inherit from
    - get_db(): a FastAPI dependency that yields a request-scoped session
"""

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# --------------------------------------------------------------------------
# Engine
# --------------------------------------------------------------------------
# The Engine manages the underlying connection pool to PostgreSQL.
#   - pool_pre_ping=True: issues a lightweight "SELECT 1" before checking a
#     connection out of the pool, transparently recycling stale/dropped
#     connections (important for long-lived DB connections behind
#     load balancers, firewalls, or after DB restarts).
#   - future=True: opts into SQLAlchemy 2.0-style engine/connection behavior.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)

# --------------------------------------------------------------------------
# Session factory
# --------------------------------------------------------------------------
# autocommit=False: transactions must be explicitly committed.
# autoflush=False: objects are not auto-flushed to the DB before queries;
#                  flushes happen explicitly on commit or manual flush().
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# --------------------------------------------------------------------------
# Declarative base
# --------------------------------------------------------------------------
class Base(DeclarativeBase):
    """
    Base class for all ORM models. Using SQLAlchemy 2.x's typed
    `DeclarativeBase` (rather than the legacy `declarative_base()` factory
    function) gives models full compatibility with SQLAlchemy 2.0 typing
    features (e.g. `Mapped[...]`, `mapped_column(...)`).
    """

    pass


# --------------------------------------------------------------------------
# Dependency
# --------------------------------------------------------------------------
def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a request-scoped SQLAlchemy session.

    Yields:
        Session: an active SQLAlchemy session for the duration of the request.

    Ensures the session is always closed after the request completes,
    even if an exception is raised, preventing connection leaks.
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()