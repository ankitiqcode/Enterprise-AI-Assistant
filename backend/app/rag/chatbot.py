from app.ai.gemini import client
from app.rag.embeddings import get_embedding
from app.rag.prompts import CHAT_PROMPT
from app.rag.vector_store import collection


def ask_question(
    question: str,
    user_id: int,
):
    # ======================================================
    # Create embedding for user question
    # ======================================================

    query_embedding = get_embedding(question)

    # ======================================================
    # Search only documents uploaded by current user
    # ======================================================

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5,
        where={"uploaded_by": user_id},
    )

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]

    # ======================================================
    # No matching documents
    # ======================================================

    if not documents:
        return {
            "answer": (
                "I couldn't find this information "
                "in the uploaded documents."
            ),
            "context_chunks": 0,
            "sources": [],
        }

    # ======================================================
    # Build context
    # ======================================================

    context = "\n\n".join(documents)

    # ======================================================
    # Debug
    # ======================================================

    print("\n" + "=" * 80)
    print("QUESTION:")
    print(question)

    print("\nDOCUMENTS:")
    print(documents)

    print("\nCONTEXT:")
    print(context)

    print("=" * 80 + "\n")

    # ======================================================
    # Create Gemini prompt
    # ======================================================

    prompt = CHAT_PROMPT.format(
        context=context,
        question=question,
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    answer = getattr(
        response,
        "text",
        "",
    ).strip()

    if not answer:
        answer = "No response generated."

    # ======================================================
    # Collect unique sources
    # ======================================================

    sources = []
    seen = set()

    for metadata in metadatas:

        if not metadata:
            continue

        document_id = metadata.get("document_id")
        filename = metadata.get("filename")

        if document_id is None or filename is None:
            continue

        key = (
            document_id,
            filename,
        )

        if key not in seen:
            seen.add(key)

            sources.append(
                {
                    "document_id": document_id,
                    "filename": filename,
                }
            )

    # ======================================================
    # Response
    # ======================================================

    return {
        "answer": answer,
        "context_chunks": len(documents),
        "sources": sources,
    }