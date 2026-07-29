"""
app/schemas/chat.py

Schemas for AI Chat.
"""

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    """
    Chat request.
    """

    question: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="User question.",
    )


class ChatResponse(BaseModel):
    """
    Chat response.
    """

    answer: str

    model_config = ConfigDict(
        from_attributes=True,
    )