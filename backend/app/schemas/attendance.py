from datetime import date, time, datetime
from typing import Optional

from pydantic import BaseModel, Field


class AttendanceBase(BaseModel):
    employee_id: int = Field(..., examples=[1])
    attendance_date: date = Field(..., examples=["2026-07-23"])
    check_in: Optional[time] = Field(None, examples=["09:00:00"])
    check_out: Optional[time] = Field(None, examples=["18:00:00"])
    status: str = Field(
        default="Present",
        examples=["Present"],
    )


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    status: Optional[str] = Field(
        default=None,
        examples=["Leave"],
    )


class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }