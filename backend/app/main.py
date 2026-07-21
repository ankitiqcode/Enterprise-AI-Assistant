from fastapi import FastAPI

app = FastAPI(
    title="Enterprise AI Assistant",
    version="1.0.0",
    description="Enterprise AI Chatbot API"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to Enterprise AI Assistant"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }