"""
app/schemas/ai_workflow.py

Schemas for AI Workflow Engine.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class AIWorkflowRequest(BaseModel):
    """
    Request schema for AI workflow execution.
    """

    feature: str = Field(
        ...,
        examples=[
            "rag",
            "resume_analysis",
            "hr_assistant",
        ],
    )

    prompt: str = Field(
        ...,
        min_length=1,
    )

    conversation_id: int | None = None


class AIWorkflowResponse(BaseModel):
    """
    Workflow response.
    """

    model_config = ConfigDict(
        from_attributes=True,
    )

    conversation_id: int

    feature: str

    answer: str

    response_time: float

    input_tokens: int

    output_tokens: int

    total_tokens: int