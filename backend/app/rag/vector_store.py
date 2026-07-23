import chromadb

client = chromadb.PersistentClient(
    path="app/chroma_db"
)

collection = client.get_or_create_collection(
    name="company_documents",
    metadata={
        "description": "Enterprise AI HRMS RAG Documents"
    }
)