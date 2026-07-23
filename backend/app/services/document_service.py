from sqlalchemy.orm import Session

from app.models.document import Document
from app.rag.delete_vectors import delete_document_vectors


def create_document(
    db: Session,
    filename: str,
    original_filename: str,
    file_hash: str,
    uploaded_by: int,
):
    """
    Save uploaded document metadata in PostgreSQL.
    """
    document = Document(
        filename=filename,
        original_filename=original_filename,
        file_hash=file_hash,
        uploaded_by=uploaded_by,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document


def get_document_by_hash(
    db: Session,
    file_hash: str,
):
    """
    Check if the uploaded document already exists.
    """
    return (
        db.query(Document)
        .filter(Document.file_hash == file_hash)
        .first()
    )


def get_document_by_id(
    db: Session,
    document_id: int,
):
    """
    Get document by ID.
    """
    return (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )


def get_all_documents(
    db: Session,
):
    """
    Return all uploaded documents.
    """
    return (
        db.query(Document)
        .order_by(Document.created_at.desc())
        .all()
    )


def delete_document(
    db: Session,
    document: Document,
):
    """
    Delete document from ChromaDB and PostgreSQL.
    """

    # Delete all vector embeddings
    delete_document_vectors(document.id)

    # Delete metadata from PostgreSQL
    db.delete(document)
    db.commit()