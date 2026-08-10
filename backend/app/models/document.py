"""
app/models/document.py

Document model for uploaded files used by the Enterprise AI Assistant.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    BigInteger,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Document(Base):
    """
    Stores uploaded document metadata.

    The actual file is stored on disk while this table stores
    metadata required for retrieval, indexing and management.
    """

    __tablename__ = "documents"

    # ======================================================
    # Primary Key
    # ======================================================

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    # ======================================================
    # Uploaded By
    # ======================================================

    uploaded_by: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ======================================================
    # File Information
    # ======================================================

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    file_path: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    file_hash: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        unique=True,
        index=True,
    )

    mime_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    file_size: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
    )

    # ======================================================
    # Indexing
    # ======================================================

    is_indexed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # ======================================================
    # Timestamps
    # ======================================================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ======================================================
    # Relationship
    # ======================================================

    user = relationship(
        "User",
        back_populates="documents",
    )

    # ======================================================
    # Representation
    # ======================================================

    def __repr__(self) -> str:
        return (
            f"<Document("
            f"id={self.id}, "
            f"filename='{self.original_filename}', "
            f"uploaded_by={self.uploaded_by}, "
            f"indexed={self.is_indexed}"
            f")>"
        )