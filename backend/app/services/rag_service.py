"""
app/services/rag_service.py

Retrieval-Augmented Generation (RAG) Service.
"""

from __future__ import annotations

import uuid

from app.services.embedding_service import (
    generate_embedding,
    generate_embeddings,
)
from app.services.gemini_service import generate_rag_response
from app.services.vector_store_service import vector_store


# ==========================================================
# Configuration
# ==========================================================

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


# ==========================================================
# Chunk Text
# ==========================================================

def chunk_text(
    text: str,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[str]:
    """
    Split text into overlapping chunks.
    """

    if not text or not text.strip():
        return []

    if chunk_size <= 0:
        raise ValueError(
            "chunk_size must be greater than 0."
        )

    if overlap < 0:
        raise ValueError(
            "overlap cannot be negative."
        )

    if overlap >= chunk_size:
        raise ValueError(
            "overlap must be smaller than chunk_size."
        )

    chunks: list[str] = []

    start = 0
    step = chunk_size - overlap

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start += step

    return chunks


# ==========================================================
# Index Document
# ==========================================================

def index_document(
    *,
    document_id: int,
    text: str,
    source: str,
) -> int:
    """
    Chunk a document and store its embeddings in ChromaDB.

    Returns:
        Number of indexed chunks.
    """

    chunks = chunk_text(text)

    if not chunks:
        return 0

    # ------------------------------------------------------
    # Generate embeddings
    # ------------------------------------------------------

    embeddings = generate_embeddings(
        chunks
    )

    if not embeddings:
        return 0

    # ------------------------------------------------------
    # Generate unique vector IDs
    # ------------------------------------------------------

    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    # ------------------------------------------------------
    # Metadata
    # ------------------------------------------------------

    metadatas = [
        {
            "document_id": document_id,
            "source": source,
            "chunk": index,
        }
        for index in range(len(chunks))
    ]

    # ------------------------------------------------------
    # Store vectors
    # ------------------------------------------------------

    vector_store.add_documents(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)


# ==========================================================
# Retrieve Context
# ==========================================================

def retrieve_context(
    query: str,
    top_k: int = 5,
) -> list[str]:
    """
    Retrieve relevant document chunks.
    """

    if not query or not query.strip():
        return []

    if top_k <= 0:
        return []

    # ------------------------------------------------------
    # Generate query embedding
    # ------------------------------------------------------

    query_embedding = generate_embedding(
        query
    )

    # ------------------------------------------------------
    # Search vector store
    # ------------------------------------------------------

    results = vector_store.search(
        query_embedding=query_embedding,
        top_k=top_k,
    )

    documents = results.get(
        "documents",
        [],
    )

    if not documents:
        return []

    # ChromaDB commonly returns:
    # [
    #     ["chunk 1", "chunk 2", ...]
    # ]

    if isinstance(documents[0], list):
        return documents[0]

    return documents


# ==========================================================
# Delete Document Vectors
# ==========================================================

def delete_document_vectors(
    document_id: int,
) -> None:
    """
    Remove all vectors belonging to a document.
    """

    vector_store.delete_by_document(
        document_id=document_id,
    )


# ==========================================================
# Ask Question
# ==========================================================

def ask_question(
    question: str,
) -> str:
    """
    Retrieve relevant document context and
    generate an AI answer.
    """

    if not question or not question.strip():
        return (
            "Please provide a question."
        )

    context = retrieve_context(
        question
    )

    if not context:
        return (
            "I couldn't find any relevant information "
            "in the uploaded documents."
        )

    return generate_rag_response(
        question=question,
        context=context,
    )