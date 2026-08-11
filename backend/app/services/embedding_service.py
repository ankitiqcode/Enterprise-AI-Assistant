"""
app/services/embedding_service.py

Lazy-loaded Sentence Transformer Embedding Service.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Any

from app.core.config import settings


# ==========================================================
# Embedding Model Configuration
# ==========================================================

MODEL_NAME = settings.EMBEDDING_MODEL


# ==========================================================
# Load Embedding Model Lazily
# ==========================================================

@lru_cache(maxsize=1)
def get_embedding_model() -> Any:
    """
    Load the SentenceTransformer model only when it is needed.

    The model is NOT imported or loaded during application startup.
    It is cached after the first use so subsequent requests reuse
    the same model instance.
    """

    # Lazy import to reduce application startup memory usage.
    from sentence_transformers import SentenceTransformer

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
    Generate an embedding for a single text.
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

    Empty values are ignored.
    """

    if not texts:
        return []

    cleaned_texts = [
        text.strip()
        for text in texts
        if text and text.strip()
    ]

    if not cleaned_texts:
        return []

    model = get_embedding_model()

    embeddings = model.encode(
        cleaned_texts,
        normalize_embeddings=True,
        show_progress_bar=False,
    )

    return embeddings.tolist()


# ==========================================================
# Clear Model Cache
# ==========================================================

def unload_embedding_model() -> None:
    """
    Clear the cached embedding model.

    Useful when memory needs to be released.
    """

    get_embedding_model.cache_clear()