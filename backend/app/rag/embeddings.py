"""
app/rag/embeddings.py

Embedding helpers for the RAG system.

The SentenceTransformer model is loaded lazily so that
the FastAPI application does not consume large amounts
of memory during startup.
"""

from __future__ import annotations

from app.services.embedding_service import (
    generate_embedding,
    generate_embeddings,
)


# ==========================================================
# Single Text Embedding
# ==========================================================

def get_embedding(text: str) -> list[float]:
    """
    Generate an embedding for a single text.
    """

    return generate_embedding(text)


# ==========================================================
# Multiple Text Embeddings
# ==========================================================

def get_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate embeddings for multiple texts.
    """

    return generate_embeddings(texts)