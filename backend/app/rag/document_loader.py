from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.rag.embeddings import get_embeddings
from app.rag.vector_store import collection
from app.utils.docx_reader import extract_docx_text
from app.utils.pdf_reader import extract_pdf_text


# ==========================================================
# Load Document
# ==========================================================

def load_document(file_path: str):
    """
    Read PDF/DOCX document and split it into chunks.
    """

    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        text = extract_pdf_text(file_path)

    elif extension == ".docx":
        text = extract_docx_text(file_path)

    else:
        raise ValueError("Unsupported file type")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
    )

    chunks = splitter.split_text(text)

    return chunks


# ==========================================================
# Store Document
# ==========================================================

def store_document(
    file_path: str,
    document_id: int,
    filename: str,
    uploaded_by: int,
):
    """
    Load document, generate embeddings and store
    chunks in ChromaDB.
    """

    chunks = load_document(file_path)

    # ------------------------------------------------------
    # Generate embeddings lazily
    # ------------------------------------------------------

    embeddings = get_embeddings(chunks)

    # ------------------------------------------------------
    # Generate unique IDs
    # ------------------------------------------------------

    ids = [
        f"{document_id}_{i}"
        for i in range(len(chunks))
    ]

    # ------------------------------------------------------
    # Metadata
    # ------------------------------------------------------

    metadatas = [
        {
            "document_id": document_id,
            "filename": filename,
            "uploaded_by": uploaded_by,
            "chunk_index": i,
        }
        for i in range(len(chunks))
    ]

    # ------------------------------------------------------
    # Store in ChromaDB
    # ------------------------------------------------------

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)