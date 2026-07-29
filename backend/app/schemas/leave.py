"""
app/schemas/leave.py

Pydantic schemas for Leave Management APIs.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)

from app.models.leave import LeaveStatus


class LeaveBase(BaseModel):
    employee_id: int = Field(
        ...,
        gt=0,
        examples=[1],
        description="Employee ID",
    )

    leave_type: str = Field(
        ...,
        min_length=2,
        max_length=50,
        examples=["Sick Leave"],
        description="Type of leave",
    )

    start_date: date = Field(
        ...,
        examples=["2026-07-25"],
    )

    end_date: date = Field(
        ...,
        examples=["2026-07-27"],
    )

    reason: str = Field(
        ...,
        min_length=5,
        max_length=255,
        examples=["High fever and doctor advised bed rest"],
    )

    @field_validator("end_date")
    @classmethod
    def validate_leave_dates(
        cls,
        value: date,
        info,
    ) -> date:
        start_date = info.data.get("start_date")

        if (
            start_date is not None
            and value < start_date
        ):
            raise ValueError(
                "End date cannot be earlier than start date."
            )

        return value


class LeaveCreate(LeaveBase):
    """Schema for applying leave."""
    pass


class LeaveUpdate(BaseModel):
    leave_type: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    start_date: Optional[date] = None

    end_date: Optional[date] = None

    reason: Optional[str] = Field(
        default=None,
        min_length=5,
        max_length=255,
    )

    status: Optional[LeaveStatus] = None

    @field_validator("end_date")
    @classmethod
    def validate_leave_dates(
        cls,
        value: Optional[date],
        info,
    ) -> Optional[date]:
        start_date = info.data.get("start_date")

        if (
            value is not None
            and start_date is not None
            and value < start_date
        ):
            raise ValueError(
                "End date cannot be earlier than start date."
            )

        return value


class LeaveResponse(LeaveBase):
    id: int
    status: LeaveStatus
    applied_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class LeaveListResponse(BaseModel):
    total: int
    data: list[LeaveResponse]

    model_config = ConfigDict(
        from_attributes=True,
    )