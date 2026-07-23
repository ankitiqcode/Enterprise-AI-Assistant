from app.rag.vector_store import collection


def delete_document_vectors(document_id: int):
    """
    Delete all vectors belonging to a document.
    """

    results = collection.get()

    ids_to_delete = []

    for vector_id in results["ids"]:
        if vector_id.startswith(f"{document_id}_"):
            ids_to_delete.append(vector_id)

    if ids_to_delete:
        collection.delete(ids=ids_to_delete)

    return len(ids_to_delete)