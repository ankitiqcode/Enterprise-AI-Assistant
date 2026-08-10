"""
app/services/embedding_service.py

Sentence Transformer Embedding Service.
"""

from __future__ import annotations

from functools import lru_cache

from sentence_transformers import SentenceTransformer

from app.core.config import settings


# ==========================================================
# Embedding Model
# ==========================================================

MODEL_NAME = settings.EMBEDDING_MODEL


# ==========================================================
# Load Model
# ==========================================================

@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """
    Load the embedding model once.

    The lru_cache ensures the model is loaded only once
    during the application process.
    """

    return SentenceTransformer(
        MODEL_NAME
    )


# ==========================================================
# Single Embedding
# ==========================================================

def generate_embedding(
    text: str,
) -> list[float]:
    """
    Generate embedding for a single text.
    """

    if not text or not text.strip():
        return []

    model = get_embedding_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True,
    )

    return embedding.tolist()


# ==========================================================
# Multiple Embeddings
# ==========================================================

def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate embeddings for multiple texts.
    """

    if not texts:
        return []

    cleaned_texts = [
        text
        for text in texts
        if text and text.strip()
    ]

    if not cleaned_texts:
        return []

    model = get_embedding_model()

    embeddings = model.encode(
        cleaned_texts,
        normalize_embeddings=True,
    )

    return embeddings.tolist()