from pathlib import Path

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.rag.embeddings import embedding_model
from app.rag.vector_store import collection
from app.utils.docx_reader import extract_docx_text
from app.utils.pdf_reader import extract_pdf_text


def load_document(file_path: str):
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


def store_document(
    file_path: str,
    document_id: int,
    filename: str,
    uploaded_by: int,
):
    chunks = load_document(file_path)

    embeddings = embedding_model.encode(chunks).tolist()

    ids = [
        f"{document_id}_{i}"
        for i in range(len(chunks))
    ]

    metadatas = [
        {
            "document_id": document_id,
            "filename": filename,
            "uploaded_by": uploaded_by,
            "chunk_index": i,
        }
        for i in range(len(chunks))
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(chunks)