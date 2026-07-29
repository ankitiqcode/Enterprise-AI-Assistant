"""
app/routers/document.py

Document Management Router
"""

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.document import (
    DeleteDocumentResponse,
    DocumentListResponse,
    DocumentResponse,
    UploadResponse,
)
from app.services import document_service

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin", "hr")
    ),
):
    """
    Upload and index a document.
    """

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    temp_path = f"temp_{file.filename}"

    with open(temp_path, "wb") as temp_file:
        temp_file.write(contents)

    document = document_service.upload_document(
        db=db,
        uploaded_by=current_user.id,
        filename=file.filename,
        file_path=temp_path,
        mime_type=file.content_type,
        file_size=len(contents),
    )

    return UploadResponse(
        message="Document uploaded successfully.",
        document=document,
    )


@router.get(
    "",
    response_model=DocumentListResponse,
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


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
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


@router.put(
    "/{document_id}/reindex",
    response_model=DocumentResponse,
)
def reindex_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin", "hr")
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


@router.delete(
    "/{document_id}",
    response_model=DeleteDocumentResponse,
)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin")
    ),
):
    """
    Delete a document.
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