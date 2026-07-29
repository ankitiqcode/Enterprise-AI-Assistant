"""
app/schemas/prompt.py

Pydantic schemas for Prompt Management.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PromptCreate(BaseModel):
    """
    Create a new AI prompt.
    """

    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=255,
    )

    prompt: str = Field(
        ...,
        min_length=1,
    )

    category: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )


class PromptUpdate(BaseModel):
    """
    Update an existing prompt.
    """

    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=255,
    )

    prompt: str | None = None

    category: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    is_active: bool | None = None


class PromptResponse(BaseModel):
    """
    Prompt response schema.
    """

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    name: str
    description: str | None
    prompt: str
    category: str
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime


class PromptListResponse(BaseModel):
    """
    List of prompts.
    """

    prompts: list[PromptResponse]


class DeletePromptResponse(BaseModel):
    """
    Delete prompt response.
    """

    message: str