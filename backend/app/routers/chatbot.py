"""
app/routers/chatbot.py

Enterprise RAG Chatbot Router
"""

from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
)
from app.services.rag_service import ask_question

router = APIRouter(
    prefix="/chatbot",
    tags=["RAG Chatbot"],
)


@router.post(
    "/chat",
    response_model=ChatResponse,
)
def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Ask questions using uploaded documents.
    """

    answer = ask_question(
        question=request.question,
    )

    return ChatResponse(
        question=request.question,
        answer=answer,
    )