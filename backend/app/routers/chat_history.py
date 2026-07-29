"""
app/routers/chat_history.py

API endpoints for AI Chat History.
"""

from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.chat_history import (
    ChatMessageResponse,
    ConversationCreate,
    ConversationListResponse,
    ConversationResponse,
    ConversationUpdate,
    DeleteConversationResponse,
    MessageResponse,
)
from app.services import chat_history_service
router = APIRouter(
    prefix="/chat-history",
    tags=["Chat History"],
)

@router.post(
    "/conversations",
    response_model=ConversationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_conversation(
    request: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    ),
):
    """
    Create a new chat conversation.
    """

    return chat_history_service.create_conversation(
        db=db,
        user_id=current_user.id,
        title=request.title,
    )

@router.get(
    "/conversations",
    response_model=ConversationListResponse,
)
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    )
):
    """
    Get all conversations for the logged-in user.
    """

    conversations = (
        chat_history_service.get_conversations(
            db=db,
            user_id=current_user.id,
        )
    )

    return ConversationListResponse(
        conversations=conversations,
    )

@router.get(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
)
def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    )
):
    """
    Retrieve a conversation by ID.
    """

    return chat_history_service.get_conversation_by_id(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id,
    )

@router.put(
    "/conversations/{conversation_id}",
    response_model=ConversationResponse,
)
def update_conversation(
    conversation_id: int,
    request: ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    )
):
    """
    Update conversation title.
    """

    conversation = (
        chat_history_service.get_conversation_by_id(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
    )

    return chat_history_service.update_conversation(
        db=db,
        conversation=conversation,
        title=request.title,
        user_id=current_user.id,
    )

from app.schemas.chat_history import (
    ChatMessageResponse,
    ConversationUpdate,
    DeleteConversationResponse,
    MessageResponse,
)

@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=list[MessageResponse],
)
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    )
):
    """
    Retrieve all messages in a conversation.
    """

    conversation = (
        chat_history_service.get_conversation_by_id(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
    )

    return chat_history_service.get_messages(
        db=db,
        conversation=conversation,
    )

@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=ChatMessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def save_chat_exchange(
    conversation_id: int,
    user_prompt: str,
    assistant_response: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    )
):
    """
    Save a complete chat exchange.
    """

    conversation = (
        chat_history_service.get_conversation_by_id(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
    )

    user_message, assistant_message = (
        chat_history_service.save_chat_exchange(
            db=db,
            conversation=conversation,
            user_prompt=user_prompt,
            assistant_response=assistant_response,
            user_id=current_user.id,
        )
    )

    return ChatMessageResponse(
        conversation=conversation,
        user_message=user_message,
        assistant_message=assistant_message,
    )

@router.delete(
    "/conversations/{conversation_id}",
    response_model=DeleteConversationResponse,
)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    )
):
    """
    Delete a conversation.
    """

    conversation = (
        chat_history_service.get_conversation_by_id(
            db=db,
            conversation_id=conversation_id,
            user_id=current_user.id,
        )
    )

    chat_history_service.delete_conversation(
        db=db,
        conversation=conversation,
        user_id=current_user.id,
    )

    return DeleteConversationResponse(
        message="Conversation deleted successfully.",
    )

