"""
app/services/document_service.py

Enterprise Document Management Service.

Responsibilities:
- Validate uploaded files
- Store files securely
- Prevent duplicate uploads
- Extract document text
- Index documents into ChromaDB
- CRUD operations
- Manage document metadata
"""

from __future__ import annotations

import hashlib
import shutil
import uuid
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.document import Document
from app.services.audit_log_service import log_action
from app.services.rag_service import (
    delete_document_vectors,
    index_document,
)
from app.utils.docx_reader import extract_docx_text
from app.utils.pdf_reader import extract_pdf_text


# ==========================================================
# Supported Files
# ==========================================================

SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
}


# ==========================================================
# Upload Directory
# ==========================================================

UPLOAD_DIRECTORY = Path(
    settings.UPLOAD_DIR
)

UPLOAD_DIRECTORY.mkdir(
    parents=True,
    exist_ok=True,
)


# ==========================================================
# Calculate File Hash
# ==========================================================

def _calculate_file_hash(
    file_path: str,
) -> str:
    """
    Generate SHA256 hash for a file.
    """

    sha256 = hashlib.sha256()

    with open(
        file_path,
        "rb",
    ) as file:

        while chunk := file.read(8192):
            sha256.update(chunk)

    return sha256.hexdigest()


# ==========================================================
# Validate Extension
# ==========================================================

def _validate_extension(
    filename: str,
) -> str:
    """
    Validate uploaded file extension.
    """

    extension = (
        Path(filename)
        .suffix
        .lower()
    )

    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only PDF, DOCX and TXT files are supported."
            ),
        )

    return extension


# ==========================================================
# Validate File Size
# ==========================================================

def _validate_file_size(
    file_size: int,
) -> None:
    """
    Validate uploaded file size.
    """

    max_size = (
        settings.MAX_UPLOAD_SIZE_MB
        * 1024
        * 1024
    )

    if file_size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Maximum allowed size is "
                f"{settings.MAX_UPLOAD_SIZE_MB} MB."
            ),
        )


# ==========================================================
# Extract Text
# ==========================================================

def _extract_text(
    file_path: str,
    extension: str,
) -> str:
    """
    Extract text from supported files.
    """

    if extension == ".pdf":
        return extract_pdf_text(file_path)

    if extension == ".docx":
        return extract_docx_text(file_path)

    if extension == ".txt":
        with open(
            file_path,
            "r",
            encoding="utf-8",
        ) as file:
            return file.read()

    return ""


# ==========================================================
# Upload Document
# ==========================================================

def upload_document(
    db: Session,
    *,
    uploaded_by: int,
    filename: str,
    file_path: str,
    mime_type: str,
    file_size: int,
) -> Document:
    """
    Upload, validate, extract text and index a document.
    """

    extension = _validate_extension(
        filename
    )

    _validate_file_size(
        file_size
    )

    # ------------------------------------------------------
    # Calculate Hash
    # ------------------------------------------------------

    file_hash = _calculate_file_hash(
        file_path
    )

    # ------------------------------------------------------
    # Duplicate Check
    # ------------------------------------------------------

    existing_document = (
        db.query(Document)
        .filter(
            Document.file_hash == file_hash
        )
        .first()
    )

    if existing_document:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This document has already been uploaded."
            ),
        )

    # ------------------------------------------------------
    # Generate Safe Unique Filename
    # ------------------------------------------------------

    unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )

    destination = (
        UPLOAD_DIRECTORY
        / unique_filename
    )

    try:

        # --------------------------------------------------
        # Move Uploaded File
        # --------------------------------------------------

        shutil.move(
            file_path,
            destination,
        )

        # --------------------------------------------------
        # Create Database Record
        # --------------------------------------------------

        document = Document(
            uploaded_by=uploaded_by,
            filename=unique_filename,
            original_filename=filename,
            file_path=str(destination),
            file_hash=file_hash,
            mime_type=mime_type,
            file_size=file_size,
            is_indexed=False,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        # --------------------------------------------------
        # Extract Text
        # --------------------------------------------------

        text = _extract_text(
            str(destination),
            extension,
        )

        # --------------------------------------------------
        # Index Document
        # --------------------------------------------------

        if text.strip():

            index_document(
                document_id=document.id,
                text=text,
                source=document.original_filename,
            )

            document.is_indexed = True

            db.commit()
            db.refresh(document)

        # --------------------------------------------------
        # Audit Log
        # --------------------------------------------------

        log_action(
            db=db,
            user_id=uploaded_by,
            module="Document",
            action="Upload",
            description=(
                f"Uploaded document: "
                f"{document.original_filename}"
            ),
        )

        return document

    except HTTPException:
        db.rollback()

        if destination.exists():
            destination.unlink()

        raise

    except SQLAlchemyError:
        db.rollback()

        if destination.exists():
            destination.unlink()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save document.",
        )

    except Exception as exc:
        db.rollback()

        if destination.exists():
            destination.unlink()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Failed to process and index document."
            ),
        ) from exc


# ==========================================================
# Get All Documents
# ==========================================================

def get_documents(
    db: Session,
) -> list[Document]:
    """
    Return all uploaded documents.
    """

    return (
        db.query(Document)
        .order_by(
            Document.created_at.desc()
        )
        .all()
    )


# ==========================================================
# Get Document By ID
# ==========================================================

def get_document_by_id(
    db: Session,
    document_id: int,
) -> Document:
    """
    Retrieve document by ID.
    """

    document = (
        db.query(Document)
        .filter(
            Document.id == document_id
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found.",
        )

    return document


# ==========================================================
# Update Document
# ==========================================================

def update_document(
    db: Session,
    *,
    document: Document,
    original_filename: str,
    user_id: int,
) -> Document:
    """
    Update document metadata.
    """

    original_filename = (
        original_filename.strip()
    )

    if not original_filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename cannot be empty.",
        )

    if len(original_filename) > 255:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename cannot exceed 255 characters.",
        )

    document.original_filename = (
        original_filename
    )

    db.commit()
    db.refresh(document)

    log_action(
        db=db,
        user_id=user_id,
        module="Document",
        action="Update",
        description=(
            f"Updated document: "
            f"{document.original_filename}"
        ),
    )

    return document


# ==========================================================
# Reindex Document
# ==========================================================

def reindex_document(
    db: Session,
    *,
    document: Document,
    user_id: int,
) -> Document:
    """
    Rebuild ChromaDB vectors for a document.
    """

    extension = (
        Path(document.file_path)
        .suffix
        .lower()
    )

    if not Path(
        document.file_path
    ).exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document file not found on disk.",
        )

    try:

        # --------------------------------------------------
        # Extract Text
        # --------------------------------------------------

        text = _extract_text(
            document.file_path,
            extension,
        )

        # --------------------------------------------------
        # Delete Existing Vectors
        # --------------------------------------------------

        delete_document_vectors(
            document.id
        )

        # --------------------------------------------------
        # Create New Vectors
        # --------------------------------------------------

        if text.strip():

            index_document(
                document_id=document.id,
                text=text,
                source=document.original_filename,
            )

            document.is_indexed = True

        else:
            document.is_indexed = False

        db.commit()
        db.refresh(document)

        # --------------------------------------------------
        # Audit Log
        # --------------------------------------------------

        log_action(
            db=db,
            user_id=user_id,
            module="Document",
            action="Reindex",
            description=(
                f"Re-indexed document: "
                f"{document.original_filename}"
            ),
        )

        return document

    except HTTPException:
        db.rollback()
        raise

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to re-index document.",
        ) from exc


# ==========================================================
# Delete Document
# ==========================================================

def delete_document(
    db: Session,
    *,
    document: Document,
    user_id: int,
) -> None:
    """
    Delete document from:
    - ChromaDB
    - File System
    - Database
    """

    try:

        # --------------------------------------------------
        # Delete Vectors
        # --------------------------------------------------

        delete_document_vectors(
            document.id
        )

        # --------------------------------------------------
        # Delete Physical File
        # --------------------------------------------------

        file_path = Path(
            document.file_path
        )

        if file_path.exists():
            file_path.unlink()

        # --------------------------------------------------
        # Audit Log
        # --------------------------------------------------

        log_action(
            db=db,
            user_id=user_id,
            module="Document",
            action="Delete",
            description=(
                f"Deleted document: "
                f"{document.original_filename}"
            ),
        )

        # --------------------------------------------------
        # Delete Database Record
        # --------------------------------------------------

        db.delete(document)
        db.commit()

    except HTTPException:
        db.rollback()
        raise

    except SQLAlchemyError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete document.",
        )

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete document.",
        ) from exc