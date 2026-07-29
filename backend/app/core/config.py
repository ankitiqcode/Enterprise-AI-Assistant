"""
app/core/config.py

Centralized application configuration for the Enterprise AI Assistant backend.

Uses Pydantic v2 (via `pydantic-settings`) to load and validate configuration
from environment variables / the .env file at project root.

Importing `settings` anywhere in the codebase gives access to a single,
validated, type-safe configuration object.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """

    # ======================================================================
    # Application
    # ======================================================================

    APP_NAME: str = Field(
        default="Enterprise AI Assistant",
        description="Application name.",
    )

    APP_ENV: str = Field(
        default="development",
        description="Application environment.",
    )

    # ======================================================================
    # Server
    # ======================================================================

    HOST: str = Field(
        default="0.0.0.0",
        description="Server host.",
    )

    PORT: int = Field(
        default=8000,
        description="Server port.",
    )

    # ======================================================================
    # Database
    # ======================================================================

    DATABASE_URL: str = Field(
        ...,
        description="PostgreSQL database connection URL.",
    )

    # ======================================================================
    # JWT Authentication
    # ======================================================================

    SECRET_KEY: str = Field(
        ...,
        description="JWT secret key.",
    )

    ALGORITHM: str = Field(
        default="HS256",
        description="JWT signing algorithm.",
    )

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60,
        description="JWT access token expiry in minutes.",
    )

    # ======================================================================
    # AI Configuration
    # ======================================================================

    AI_PROVIDER: str = Field(
        default="gemini",
        description="AI provider.",
    )

    # ======================================================================
    # Google Gemini
    # ======================================================================

    GEMINI_API_KEY: str = Field(
        ...,
        description="Google Gemini API key.",
    )

    GEMINI_MODEL: str = Field(
        default="gemini-2.5-flash",
        description="Gemini model.",
    )

    # ======================================================================
    # Embedding Model
    # ======================================================================

    EMBEDDING_MODEL: str = Field(
        default="all-MiniLM-L6-v2",
        description="Sentence Transformer embedding model.",
    )

    # ======================================================================
    # ChromaDB
    # ======================================================================

    CHROMA_DB_PATH: str = Field(
        default="app/chroma_db",
        description="Persistent ChromaDB storage path.",
    )

    CHROMA_COLLECTION_NAME: str = Field(
        default="enterprise_ai_documents",
        description="Default ChromaDB collection.",
    )

    # ======================================================================
    # File Upload
    # ======================================================================

    UPLOAD_DIR: str = Field(
        default="app/uploads",
        description="Directory for uploaded files.",
    )

    MAX_UPLOAD_SIZE_MB: int = Field(
        default=10,
        description="Maximum upload size in MB.",
    )

    ALLOWED_FILE_EXTENSIONS: list[str] = Field(
        default=[
            ".pdf",
            ".docx",
        ],
        description="Allowed upload file extensions.",
    )

    # ======================================================================
    # RAG Configuration
    # ======================================================================

    CHUNK_SIZE: int = Field(
        default=1000,
        description="Document chunk size.",
    )

    CHUNK_OVERLAP: int = Field(
        default=200,
        description="Chunk overlap.",
    )

    TOP_K_RESULTS: int = Field(
        default=5,
        description="Number of retrieved chunks.",
    )

    # ======================================================================
    # Pydantic Settings
    # ======================================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """
    Return cached settings instance.
    """
    return Settings()


settings = get_settings()