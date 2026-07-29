"""
app/schemas/attendance.py

Pydantic schemas for Attendance APIs.

Supports:
- Create Attendance
- Update Attendance
- Response Model
- List Response
"""

from __future__ import annotations

from datetime import date, datetime, time
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.attendance import AttendanceStatus


class AttendanceBase(BaseModel):
    employee_id: int = Field(
        ...,
        gt=0,
        examples=[1],
        description="Employee ID",
    )

    attendance_date: date = Field(
        ...,
        examples=["2026-07-23"],
        description="Attendance date",
    )

    check_in: Optional[time] = Field(
        default=None,
        examples=["09:00:00"],
        description="Check-in time",
    )

    check_out: Optional[time] = Field(
        default=None,
        examples=["18:00:00"],
        description="Check-out time",
    )

    status: AttendanceStatus = Field(
        default=AttendanceStatus.PRESENT,
        description="Attendance status",
    )

    @field_validator("check_out")
    @classmethod
    def validate_check_out(
        cls,
        value: Optional[time],
        info,
    ) -> Optional[time]:
        """
        Ensure check-out is later than check-in.
        """
        check_in = info.data.get("check_in")

        if (
            value is not None
            and check_in is not None
            and value <= check_in
        ):
            raise ValueError(
                "Check-out time must be later than check-in time."
            )

        return value


class AttendanceCreate(AttendanceBase):
    """Schema for creating attendance."""
    pass


class AttendanceUpdate(BaseModel):
    check_in: Optional[time] = Field(
        default=None,
        examples=["09:15:00"],
    )

    check_out: Optional[time] = Field(
        default=None,
        examples=["18:10:00"],
    )

    status: Optional[AttendanceStatus] = Field(
        default=None,
    )

    @field_validator("check_out")
    @classmethod
    def validate_check_out(
        cls,
        value: Optional[time],
        info,
    ) -> Optional[time]:
        check_in = info.data.get("check_in")

        if (
            value is not None
            and check_in is not None
            and value <= check_in
        ):
            raise ValueError(
                "Check-out time must be later than check-in time."
            )

        return value


class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class AttendanceListResponse(BaseModel):
    total: int
    data: list[AttendanceResponse]

    model_config = ConfigDict(
        from_attributes=True,
    )