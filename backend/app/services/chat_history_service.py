"""
app/services/chat_history_service.py

Business logic for AI chat conversations and messages.
"""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.chat_history import (
    Conversation,
    Message,
)
from app.services.audit_log_service import log_action


def create_conversation(
    db: Session,
    *,
    user_id: int,
    title: str,
) -> Conversation:
    """
    Create a new conversation.
    """

    conversation = Conversation(
        user_id=user_id,
        title=title,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    log_action(
        db=db,
        user_id=user_id,
        module="Chat History",
        action="Create Conversation",
        description=(
            f"Created conversation: "
            f"{conversation.title}"
        ),
    )

    return conversation


def get_conversations(
    db: Session,
    *,
    user_id: int,
) -> list[Conversation]:
    """
    Get all conversations for a user.
    """

    return (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user_id,
        )
        .order_by(
            Conversation.updated_at.desc(),
        )
        .all()
    )


def get_conversation_by_id(
    db: Session,
    *,
    conversation_id: int,
    user_id: int,
) -> Conversation:
    """
    Get conversation by ID.
    """

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        .first()
    )

    if conversation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found.",
        )

    return conversation


def save_user_message(
    db: Session,
    *,
    conversation: Conversation,
    content: str,
) -> Message:
    """
    Save a user message.
    """

    message = Message(
        conversation_id=conversation.id,
        role="user",
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def save_assistant_message(
    db: Session,
    *,
    conversation: Conversation,
    content: str,
) -> Message:
    """
    Save assistant response.
    """

    message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_messages(
    db: Session,
    *,
    conversation: Conversation,
) -> list[Message]:
    """
    Retrieve all messages for a conversation.
    """

    return (
        db.query(Message)
        .filter(
            Message.conversation_id == conversation.id,
        )
        .order_by(
            Message.created_at.asc(),
        )
        .all()
    )


def update_conversation(
    db: Session,
    *,
    conversation: Conversation,
    title: str,
    user_id: int,
) -> Conversation:
    """
    Update conversation title.
    """

    old_title = conversation.title

    conversation.title = title

    db.commit()
    db.refresh(conversation)

    log_action(
        db=db,
        user_id=user_id,
        module="Chat History",
        action="Update Conversation",
        description=(
            f"Renamed conversation "
            f"from '{old_title}' "
            f"to '{conversation.title}'."
        ),
    )

    return conversation

def delete_conversation(
    db: Session,
    *,
    conversation: Conversation,
    user_id: int,
) -> None:
    """
    Delete a conversation and all its messages.
    """

    conversation_title = conversation.title

    log_action(
        db=db,
        user_id=user_id,
        module="Chat History",
        action="Delete Conversation",
        description=(
            f"Deleted conversation: "
            f"{conversation_title}"
        ),
    )

    db.delete(conversation)
    db.commit()


def save_chat_exchange(
    db: Session,
    *,
    conversation: Conversation,
    user_prompt: str,
    assistant_response: str,
    user_id: int,
) -> tuple[Message, Message]:
    """
    Save both the user message and assistant response
    in a single database transaction.
    """

    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=user_prompt,
    )

    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=assistant_response,
    )

    db.add_all(
        [
            user_message,
            assistant_message,
        ]
    )

    db.commit()

    db.refresh(user_message)
    db.refresh(assistant_message)

    log_action(
        db=db,
        user_id=user_id,
        module="Chat History",
        action="Chat Exchange",
        description=(
            f"Conversation '{conversation.title}' "
            f"received a new chat exchange."
        ),
    )

    return (
        user_message,
        assistant_message,
    )


def get_latest_conversation(
    db: Session,
    *,
    user_id: int,
) -> Conversation | None:
    """
    Return the most recently updated conversation
    for the specified user.
    """

    return (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user_id,
        )
        .order_by(
            Conversation.updated_at.desc(),
        )
        .first()
    )