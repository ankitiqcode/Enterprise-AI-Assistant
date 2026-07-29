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


CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


def chunk_text(
    text: str,
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP,
) -> list[str]:
    """
    Split text into overlapping chunks.
    """

    if not text.strip():
        return []

    chunks: list[str] = []

    start = 0

    while start < len(text):
        end = start + chunk_size

        chunks.append(text[start:end])

        start += chunk_size - overlap

    return chunks


def index_document(
    *,
    document_id: int,
    text: str,
    source: str,
) -> int:
    """
    Chunk a document and store it in ChromaDB.
    """

    chunks = chunk_text(text)

    if not chunks:
        return 0

    embeddings = generate_embeddings(chunks)

    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    metadatas = [
        {
            "document_id": document_id,
            "source": source,
            "chunk": index,
        }
        for index in range(len(chunks))
    ]

    vector_store.add_documents(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)


def retrieve_context(
    query: str,
    top_k: int = 5,
) -> list[str]:
    """
    Retrieve relevant document chunks.
    """

    query_embedding = generate_embedding(query)

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

    return documents[0]


def delete_document_vectors(
    document_id: int,
) -> None:
    """
    Remove all vectors belonging to a document.
    """

    vector_store.delete_by_document(
        document_id=document_id,
    )


def ask_question(
    question: str,
) -> str:
    """
    Retrieve relevant context and generate an AI answer.
    """

    context = retrieve_context(question)

    if not context:
        return (
            "I couldn't find any relevant information "
            "in the uploaded documents."
        )

    return generate_rag_response(
        question=question,
        context=context,
    )