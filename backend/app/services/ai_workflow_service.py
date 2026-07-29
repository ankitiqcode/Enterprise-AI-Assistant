"""
app/services/ai_workflow_service.py

Enterprise AI Workflow Engine

Coordinates:
- Prompt Management
- RAG
- Gemini
- Chat History
- AI Usage Analytics
"""

from __future__ import annotations

import time

from sqlalchemy.orm import Session

from app.models.chat_history import Conversation
from app.services import (
    ai_usage_service,
    chat_history_service,
    prompt_service,
    rag_service,
)
from app.services.audit_log_service import log_action
from app.services.gemini_service import generate_rag_response


class AIWorkflowService:
    """
    Enterprise AI Workflow Engine.

    Every AI request should go through this class.
    """

    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def _get_conversation(
        self,
        *,
        user_id: int,
        conversation_id: int | None,
        feature: str,
    ) -> Conversation:
        """
        Return existing conversation
        or create a new one.
        """

        if conversation_id:

            return (
                chat_history_service.get_conversation_by_id(
                    db=self.db,
                    conversation_id=conversation_id,
                    user_id=user_id,
                )
            )

        return (
            chat_history_service.create_conversation(
                db=self.db,
                user_id=user_id,
                title=feature.replace(
                    "_",
                    " ",
                ).title(),
            )
        )

    def _load_prompt(
        self,
        category: str,
    ) -> str:
        """
        Retrieve active prompt
        from Prompt Management.
        """

        prompt = (
            prompt_service.get_active_prompt(
                db=self.db,
                category=category,
            )
        )

        return prompt.prompt

    def _retrieve_context(
        self,
        question: str,
    ) -> str:
        """
        Retrieve document context.
        """

        context = rag_service.retrieve_context(
            question,
        )

        return "\n\n".join(context)

    def execute(
        self,
        *,
        user_id: int,
        feature: str,
        user_prompt: str,
        conversation_id: int | None = None,
    ) -> dict:
        """
        Execute the complete AI workflow.

        Flow:
        1. Load/Create conversation
        2. Load active prompt
        3. Retrieve RAG context
        4. Generate AI response
        5. Save chat history
        6. Log AI usage
        7. Audit logging
        8. Return response
        """

        start_time = time.perf_counter()

        try:

            # ---------------------------------------------
            # Get or Create Conversation
            # ---------------------------------------------

            conversation = self._get_conversation(
                user_id=user_id,
                conversation_id=conversation_id,
                feature=feature,
            )

            # ---------------------------------------------
            # Load System Prompt
            # ---------------------------------------------

            system_prompt = self._load_prompt(
                category=feature,
            )

            # ---------------------------------------------
            # Retrieve RAG Context
            # ---------------------------------------------

            context = self._retrieve_context(
                user_prompt,
            )

            full_prompt = (
                f"{system_prompt}\n\n"
                f"Context:\n{context}\n\n"
                f"User Question:\n{user_prompt}"
            )

            # ---------------------------------------------
            # Generate AI Response
            # ---------------------------------------------

            answer = generate_rag_response(
                question=user_prompt,
                context=full_prompt,
            )

            elapsed = round(
                time.perf_counter() - start_time,
                2,
            )

            # ---------------------------------------------
            # Save Chat History
            # ---------------------------------------------

            (
                user_message,
                assistant_message,
            ) = (
                chat_history_service.save_chat_exchange(
                    db=self.db,
                    conversation=conversation,
                    user_prompt=user_prompt,
                    assistant_response=answer,
                    user_id=user_id,
                )
            )

            # ---------------------------------------------
            # Log AI Usage
            # ---------------------------------------------

            ai_usage_service.log_ai_usage(
                db=self.db,
                user_id=user_id,
                feature=feature,
                model_name="gemini",
                prompt=user_prompt,
                response=answer,
                input_tokens=0,
                output_tokens=0,
                total_tokens=0,
                response_time=elapsed,
                status="success",
            )

            # ---------------------------------------------
            # Audit Log
            # ---------------------------------------------

            log_action(
                db=self.db,
                user_id=user_id,
                module="AI Workflow",
                action="Generate Response",
                description=(
                    f"Generated AI response "
                    f"using feature '{feature}'."
                ),
            )

            # ---------------------------------------------
            # Return Response
            # ---------------------------------------------

            return {
                "conversation_id": conversation.id,
                "feature": feature,
                "answer": answer,
                "response_time": elapsed,
                "input_tokens": 0,
                "output_tokens": 0,
                "total_tokens": 0,
                "user_message_id": user_message.id,
                "assistant_message_id": assistant_message.id,
            }

        except Exception as exc:

            elapsed = round(
                time.perf_counter() - start_time,
                2,
            )

            # ---------------------------------------------
            # Log Failed AI Usage
            # ---------------------------------------------

            ai_usage_service.log_ai_usage(
                db=self.db,
                user_id=user_id,
                feature=feature,
                model_name="gemini",
                prompt=user_prompt,
                response=str(exc),
                input_tokens=0,
                output_tokens=0,
                total_tokens=0,
                response_time=elapsed,
                status="failed",
            )

            # ---------------------------------------------
            # Audit Failure
            # ---------------------------------------------

            log_action(
                db=self.db,
                user_id=user_id,
                module="AI Workflow",
                action="Workflow Failed",
                description=str(exc),
            )

            raise

def get_workflow_service(
    db: Session,
) -> AIWorkflowService:
    """
    Create a workflow service instance.
    """

    return AIWorkflowService(db)