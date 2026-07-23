import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.rag.chatbot import ask_question
from app.rag.document_loader import store_document
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    DeleteResponse,
    DocumentResponse,
)
from app.services.document_service import (
    create_document,
    delete_document,
    get_all_documents,
    get_document_by_hash,
    get_document_by_id,
)
from app.utils.file_hash import calculate_file_hash

router = APIRouter(
    prefix="/chatbot",
    tags=["RAG Chatbot"],
)

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allowed = [".pdf", ".docx"]

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed.",
        )

    file_bytes = await file.read()

    file_hash = calculate_file_hash(file_bytes)

    existing = get_document_by_hash(
        db=db,
        file_hash=file_hash,
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="This document has already been uploaded.",
        )

    filename = f"{uuid.uuid4()}{extension}"
    path = UPLOAD_DIR / filename

    try:
        with open(path, "wb") as buffer:
            buffer.write(file_bytes)

        document = create_document(
            db=db,
            filename=filename,
            original_filename=file.filename,
            file_hash=file_hash,
            uploaded_by=current_user.id   # Replace with current_user.id after JWT integration
        )

        chunks = store_document(
    file_path=str(path),
    document_id=document.id,
    filename=document.original_filename,
    uploaded_by=current_user.id,
)

        return {
            "message": "Document uploaded successfully.",
            "document_id": document.id,
            "chunks": chunks,
        }

    finally:
        if path.exists():
            os.remove(path)


@router.post("/chat")
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    return ask_question(
        question=request.question,
        user_id=current_user.id,
    )


@router.get(
    "/documents",
    response_model=list[DocumentResponse],
)
def list_documents(
    db: Session = Depends(get_db),
):
    return get_all_documents(db)


@router.delete(
    "/documents/{document_id}",
    response_model=DeleteResponse,
)
def remove_document(
    document_id: int,
    db: Session = Depends(get_db),
):
    document = get_document_by_id(
        db=db,
        document_id=document_id,
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    delete_document(
        db=db,
        document=document,
    )

    return {
        "message": "Document deleted successfully."
    }

