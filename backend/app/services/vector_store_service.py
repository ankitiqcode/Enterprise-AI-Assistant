"""
app/services/vector_store_service.py

Enterprise ChromaDB service for vector storage
and semantic search.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import chromadb
from chromadb.api.models.Collection import Collection

from app.core.config import settings


# ==========================================================
# ChromaDB Configuration
# ==========================================================

CHROMA_DB_DIR = Path(
    settings.CHROMA_DB_PATH
)

CHROMA_DB_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

COLLECTION_NAME = (
    "enterprise_ai_documents"
)


# ==========================================================
# Vector Store Service
# ==========================================================

class VectorStoreService:
    """
    ChromaDB vector store service.
    """

    def __init__(self) -> None:
        """
        Initialize persistent ChromaDB client
        and document collection.
        """

        self.client = chromadb.PersistentClient(
            path=str(CHROMA_DB_DIR),
        )

        self.collection: Collection = (
            self.client.get_or_create_collection(
                name=COLLECTION_NAME,
                metadata={
                    "description": (
                        "Enterprise AI Knowledge Base"
                    ),
                },
            )
        )

    # ======================================================
    # Add Documents
    # ======================================================

    def add_documents(
        self,
        ids: list[str],
        documents: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict[str, Any]] | None = None,
    ) -> None:
        """
        Store document chunks and embeddings.
        """

        if not ids:
            return

        if not documents:
            return

        if not embeddings:
            return

        if not (
            len(ids)
            == len(documents)
            == len(embeddings)
        ):
            raise ValueError(
                "IDs, documents and embeddings "
                "must have the same length."
            )

        if metadatas is not None:
            if len(metadatas) != len(ids):
                raise ValueError(
                    "Metadata count must match "
                    "document count."
                )

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    # ======================================================
    # Search
    # ======================================================

    def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
    ) -> dict[str, Any]:
        """
        Search similar document chunks.
        """

        if not query_embedding:
            return {
                "documents": [],
                "metadatas": [],
                "distances": [],
            }

        if top_k <= 0:
            return {
                "documents": [],
                "metadatas": [],
                "distances": [],
            }

        total_documents = (
            self.collection.count()
        )

        if total_documents == 0:
            return {
                "documents": [],
                "metadatas": [],
                "distances": [],
            }

        top_k = min(
            top_k,
            total_documents,
        )

        return self.collection.query(
            query_embeddings=[
                query_embedding
            ],
            n_results=top_k,
        )

    # ======================================================
    # Delete By IDs
    # ======================================================

    def delete(
        self,
        ids: list[str],
    ) -> None:
        """
        Delete vectors by IDs.
        """

        if not ids:
            return

        self.collection.delete(
            ids=ids,
        )

    # ======================================================
    # Delete By Document
    # ======================================================

    def delete_by_document(
        self,
        document_id: int,
    ) -> None:
        """
        Delete all chunks belonging to a document.
        """

        self.collection.delete(
            where={
                "document_id": document_id,
            },
        )

    # ======================================================
    # Count
    # ======================================================

    def count(self) -> int:
        """
        Return total number of stored vectors.
        """

        return self.collection.count()


# ==========================================================
# Global Vector Store
# ==========================================================

vector_store = VectorStoreService()