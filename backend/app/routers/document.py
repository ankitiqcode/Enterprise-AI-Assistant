"""
app/routers/document.py

Document Management Router.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.document import (
    DeleteDocumentResponse,
    DocumentListResponse,
    DocumentResponse,
    DocumentUpdate,
    UploadResponse,
)
from app.services import document_service


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# ==========================================================
# Upload Document
# ==========================================================

@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Document",
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Upload and index a document.

    Allowed roles:
    - Admin
    - HR
    """

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename is required.",
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    suffix = Path(file.filename).suffix.lower()

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        document = document_service.upload_document(
            db=db,
            uploaded_by=current_user.id,
            filename=file.filename,
            file_path=temp_path,
            mime_type=(
                file.content_type
                or "application/octet-stream"
            ),
            file_size=len(contents),
        )

        return UploadResponse(
            message="Document uploaded successfully.",
            document=document,
        )

    finally:
        if (
            temp_path
            and os.path.exists(temp_path)
        ):
            os.remove(temp_path)


# ==========================================================
# Get All Documents
# ==========================================================

@router.get(
    "",
    response_model=DocumentListResponse,
    summary="Get All Documents",
)
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    ),
):
    """
    Retrieve all uploaded documents.
    """

    documents = document_service.get_documents(db)

    return DocumentListResponse(
        documents=documents,
        total=len(documents),
    )


# ==========================================================
# View / Open Document File
# ==========================================================

@router.get(
    "/{document_id}/view",
    summary="View Document File",
)
def view_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    ),
):
    """
    Open an uploaded document in the browser.
    """

    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
    )

    file_path = Path(document.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document file not found on server.",
        )

    return FileResponse(
        path=str(file_path),
        media_type=document.mime_type,
        filename=document.original_filename,
        content_disposition_type="inline",
    )


# ==========================================================
# Get Document By ID
# ==========================================================

@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Get Document By ID",
)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    ),
):
    """
    Retrieve a document by ID.
    """

    return document_service.get_document_by_id(
        db=db,
        document_id=document_id,
    )


# ==========================================================
# Update Document
# ==========================================================

@router.put(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Update Document",
)
def update_document(
    document_id: int,
    document_data: DocumentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Update document metadata.

    Currently updates:
    - Original filename
    """

    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
    )

    # Direct metadata update because the current
    # document service accepts is_indexed, not filename.
    document.original_filename = (
        document_data.original_filename
    )

    db.commit()
    db.refresh(document)

    return document


# ==========================================================
# Reindex Document
# ==========================================================

@router.put(
    "/{document_id}/reindex",
    response_model=DocumentResponse,
    summary="Reindex Document",
)
def reindex_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Rebuild embeddings for a document.
    """

    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
    )

    return document_service.reindex_document(
        db=db,
        document=document,
        user_id=current_user.id,
    )


# ==========================================================
# Delete Document
# ==========================================================

@router.delete(
    "/{document_id}",
    response_model=DeleteDocumentResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete Document",
)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
        )
    ),
):
    """
    Delete a document.

    Deletes:
    - ChromaDB vectors
    - Physical file
    - Database record

    Only Admin can delete documents.
    """

    document = document_service.get_document_by_id(
        db=db,
        document_id=document_id,
    )

    document_service.delete_document(
        db=db,
        document=document,
        user_id=current_user.id,
    )

    return DeleteDocumentResponse(
        message="Document deleted successfully.",
    )