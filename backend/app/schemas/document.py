"""
app/schemas/document.py

Pydantic schemas for document upload and management.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ==========================================================
# Document Response
# ==========================================================

class DocumentResponse(BaseModel):
    """
    Document response schema.
    """

    id: int

    filename: str

    original_filename: str

    uploaded_by: int

    file_size: int

    mime_type: str

    is_indexed: bool

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# Upload Response
# ==========================================================

class UploadResponse(BaseModel):
    """
    Response after uploading a document.
    """

    message: str = Field(
        examples=[
            "Document uploaded successfully.",
        ]
    )

    document: DocumentResponse

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# Document List Response
# ==========================================================

class DocumentListResponse(BaseModel):
    """
    Response for listing documents.
    """

    documents: list[DocumentResponse]

    total: int

    model_config = ConfigDict(
        from_attributes=True,
    )


# ==========================================================
# Document Update
# ==========================================================

class DocumentUpdate(BaseModel):
    """
    Update document metadata.
    """

    original_filename: str = Field(
        ...,
        min_length=1,
        max_length=255,
        examples=[
            "HR_Policy_2026.pdf",
        ],
    )


# ==========================================================
# Delete Response
# ==========================================================

class DeleteDocumentResponse(BaseModel):
    """
    Response after deleting a document.
    """

    message: str = Field(
        examples=[
            "Document deleted successfully.",
        ]
    )

    model_config = ConfigDict(
        from_attributes=True,
    )