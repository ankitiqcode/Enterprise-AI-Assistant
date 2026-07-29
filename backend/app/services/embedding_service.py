"""
app/services/embedding_service.py

Sentence Transformer Embedding Service.
"""

from __future__ import annotations

from functools import lru_cache

from sentence_transformers import SentenceTransformer


from app.core.config import settings

MODEL_NAME = settings.EMBEDDING_MODEL


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """
    Load the embedding model once.
    """

    return SentenceTransformer(MODEL_NAME)


def generate_embedding(text: str) -> list[float]:
    """
    Generate embedding for a single text.
    """

    model = get_embedding_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True,
    )

    return embedding.tolist()


def generate_embeddings(
    texts: list[str],
) -> list[list[float]]:
    """
    Generate embeddings for multiple texts.
    """

    model = get_embedding_model()

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
    )

    return embeddings.tolist()