from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class LeaveBase(BaseModel):
    employee_id: int = Field(..., examples=[2])
    leave_type: str = Field(..., examples=["Sick Leave"])
    start_date: date = Field(..., examples=["2026-07-25"])
    end_date: date = Field(..., examples=["2026-07-27"])
    reason: str = Field(
        ...,
        examples=["High fever and doctor advised bed rest"],
    )


class LeaveCreate(LeaveBase):
    pass


class LeaveUpdate(BaseModel):
    leave_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    reason: Optional[str] = None
    status: Optional[str] = Field(
        default=None,
        examples=["Approved"],
    )


class LeaveResponse(LeaveBase):
    id: int
    status: str
    applied_at: datetime

    model_config = {
        "from_attributes": True
    }