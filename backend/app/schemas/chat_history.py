"""
app/schemas/chat_history.py

Pydantic schemas for AI Chat History.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ==========================
# Message Schemas
# ==========================


class MessageCreate(BaseModel):
    """
    Schema for creating a chat message.
    """

    role: str = Field(
        ...,
        examples=["user"],
    )

    content: str = Field(
        ...,
        min_length=1,
    )


class MessageResponse(BaseModel):
    """
    Response schema for a chat message.
    """

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime


# ==========================
# Conversation Schemas
# ==========================


class ConversationCreate(BaseModel):
    """
    Schema for creating a conversation.
    """

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )


class ConversationUpdate(BaseModel):
    """
    Update conversation title.
    """

    title: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )


class ConversationResponse(BaseModel):
    """
    Response schema for conversation.
    """

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    user_id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse] = []


class ConversationListResponse(BaseModel):
    """
    List of conversations.
    """

    conversations: list[ConversationResponse]


class DeleteConversationResponse(BaseModel):
    """
    Delete conversation response.
    """

    message: str


class ChatMessageResponse(BaseModel):
    """
    Response after saving user + AI messages.
    """

    conversation: ConversationResponse
    user_message: MessageResponse
    assistant_message: MessageResponse