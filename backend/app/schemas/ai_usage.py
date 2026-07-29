"""
app/schemas/ai_usage.py

Pydantic schemas for AI Usage Analytics.
"""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AIUsageCreate(BaseModel):
    """
    Schema used internally for logging AI usage.
    """

    feature: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    model_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    prompt: str

    response: str

    input_tokens: int = Field(
        default=0,
        ge=0,
    )

    output_tokens: int = Field(
        default=0,
        ge=0,
    )

    total_tokens: int = Field(
        default=0,
        ge=0,
    )

    response_time: float = Field(
        ...,
        ge=0,
    )

    status: str = Field(
        default="success",
    )

    error_message: str | None = None

class AIUsageResponse(BaseModel):
    """
    Response schema for AI usage log.
    """

    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    user_id: int
    feature: str
    model_name: str
    prompt: str
    response: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    response_time: float
    status: str
    error_message: str | None
    created_at: datetime

class AIUsageListResponse(BaseModel):
    """
    List of AI usage logs.
    """

    logs: list[AIUsageResponse]

class AIUsageSummaryResponse(BaseModel):
    """
    Dashboard summary.
    """

    total_requests: int

    successful_requests: int

    failed_requests: int

    total_input_tokens: int

    total_output_tokens: int

    total_tokens: int

    average_response_time: float

class FeatureUsage(BaseModel):
    """
    Usage statistics for a feature.
    """

    feature: str

    requests: int


class AIUsageStatsResponse(BaseModel):
    """
    AI usage analytics.
    """

    most_used_feature: str | None

    features: list[FeatureUsage]