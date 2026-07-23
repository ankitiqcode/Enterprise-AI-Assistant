from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class EmployeeBase(BaseModel):
    employee_id: str = Field(..., examples=["EMP001"])
    first_name: str = Field(..., examples=["Rahul"])
    last_name: str = Field(..., examples=["Sharma"])
    email: EmailStr = Field(..., examples=["rahul.sharma@example.com"])
    phone: str = Field(..., examples=["9876543210"])
    department: str = Field(..., examples=["IT"])
    designation: str = Field(..., examples=["Software Engineer"])
    salary: Decimal = Field(..., examples=[50000.00])
    status: str = Field(default="Active", examples=["Active"])


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    salary: Optional[Decimal] = None
    status: Optional[str] = None


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }