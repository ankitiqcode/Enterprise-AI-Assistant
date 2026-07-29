"""
app/services/vector_store_service.py

Enterprise ChromaDB service for vector storage and semantic search.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

import chromadb
from chromadb.api.models.Collection import Collection

from pathlib import Path

from app.core.config import settings

CHROMA_DB_DIR = Path(settings.CHROMA_DB_PATH)
CHROMA_DB_DIR.mkdir(parents=True, exist_ok=True)

COLLECTION_NAME = "enterprise_ai_documents"


class VectorStoreService:
    """
    ChromaDB vector store service.
    """

    def __init__(self) -> None:
        self.client = chromadb.PersistentClient(
            path=str(CHROMA_DB_DIR),
        )

        self.collection: Collection = self.client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={
                "description": "Enterprise AI Knowledge Base",
            },
        )

    def add_documents(
        self,
        ids: list[str],
        documents: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict[str, Any]] | None = None,
    ) -> None:
        """
        Store document chunks.
        """

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
        )

    def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
    ) -> dict[str, Any]:
        """
        Search similar document chunks.
        """

        return self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
        )

    def delete(
        self,
        ids: list[str],
    ) -> None:
        """
        Delete vectors.
        """

        self.collection.delete(
            ids=ids,
        )

    def delete_by_document(
        self,
        document_id: int,
    ) -> None:
        """
        Delete all chunks for a document.
        """

        self.collection.delete(
            where={
                "document_id": document_id,
            },
        )

    def count(self) -> int:
        """
        Return total vectors.
        """

        return self.collection.count()


vector_store = VectorStoreService()