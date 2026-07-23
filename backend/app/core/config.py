"""
app/core/config.py

Centralized application configuration for the Enterprise AI Assistant backend.

Uses Pydantic v2 (via `pydantic-settings`) to load and validate configuration
from environment variables / the .env file at project root. Importing
`settings` anywhere in the codebase gives access to a single, validated,
type-safe configuration object (singleton pattern).
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings, populated from environment variables and/or a
    `.env` file. Pydantic v2 validates each field's type at startup, so the
    application will fail fast with a clear error if a required variable is
    missing or malformed, rather than failing later at runtime.
    """

    # ----------------------------------------------------------------------
    # General application metadata
    # ----------------------------------------------------------------------

    # Human-readable name of the application, used in docs, logs, and
    # response headers/messages.
    APP_NAME: str = Field(
        default="Enterprise AI Assistant",
        description="Display name of the application.",
    )

    # Current runtime environment. Typical values: "development", "staging",
    # "production". Application code (e.g. logging verbosity, docs
    # visibility) can branch on this value.
    APP_ENV: str = Field(
        default="development",
        description="Runtime environment: development | staging | production.",
    )

    # ----------------------------------------------------------------------
    # Server / networking
    # ----------------------------------------------------------------------

    # Host/interface the Uvicorn/FastAPI server binds to. Use "0.0.0.0" to
    # accept connections from any network interface (common in containers).
    HOST: str = Field(
        default="0.0.0.0",
        description="Network interface the server binds to.",
    )

    # TCP port the server listens on.
    PORT: int = Field(
        default=8000,
        description="Port the server listens on.",
    )

    # ----------------------------------------------------------------------
    # Database
    # ----------------------------------------------------------------------

    # Full SQLAlchemy-compatible PostgreSQL connection string, e.g.
    # "postgresql+psycopg2://user:password@localhost:5432/ai_assistant_db"
    # No default is provided intentionally: the app should fail to start
    # rather than silently connect to the wrong database.
    DATABASE_URL: str = Field(
        ...,
        description="SQLAlchemy PostgreSQL connection URL.",
    )

    # ----------------------------------------------------------------------
    # Security / JWT
    # ----------------------------------------------------------------------

    # Secret key used to sign and verify JWT access tokens. Must be a long,
    # random, secret string in production (e.g. generated via `openssl rand
    # -hex 32`). No default is provided for the same fail-fast reasoning as
    # DATABASE_URL — this must never silently fall back to a known value.
    SECRET_KEY: str = Field(
        ...,
        description="Secret key used to sign JWT tokens. Must be kept secret.",
    )

    # Signing algorithm used for JWT tokens. HS256 (HMAC-SHA256) is the
    # standard symmetric-key choice for python-jose.
    ALGORITHM: str = Field(
        default="HS256",
        description="JWT signing algorithm.",
    )

    # Lifetime of an issued access token, in minutes, before it expires and
    # the client must re-authenticate.
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60,
        description="Access token validity duration, in minutes.",
    )

    # ----------------------------------------------------------------------
    # AI provider
    # ----------------------------------------------------------------------

    # Identifies which AI/LLM provider backs the assistant's AI features
    # (e.g. "openai", "anthropic", "azure_openai"). Used by service-layer
    # code to select the correct client/integration at runtime.
    AI_PROVIDER: str = Field(
        default="openai",
        description="Identifier of the AI provider used for assistant features.",
    )

    # ----------------------------------------------------------------------
    # Pydantic Settings configuration
    # ----------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """
    Return a cached Settings instance.

    Wrapping construction in `lru_cache` ensures the .env file is parsed and
    validated only once per process, and that every caller shares the exact
    same Settings object (singleton behavior) without relying on module
    import-time side effects alone.
    """
    return Settings()


# Module-level singleton. Import this directly in application code:
#     from app.core.config import settings
settings = get_settings()