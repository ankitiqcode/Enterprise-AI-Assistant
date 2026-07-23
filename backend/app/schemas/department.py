from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DepartmentBase(BaseModel):
    department_code: str = Field(..., examples=["IT"])
    department_name: str = Field(..., examples=["Information Technology"])
    description: Optional[str] = Field(
        default=None,
        examples=["Handles software development and IT infrastructure"],
    )
    manager: Optional[str] = Field(
        default=None,
        examples=["Rahul Sharma"],
    )


class DepartmentCreate(DepartmentBase):
    pass


class DepartmentUpdate(BaseModel):
    department_code: Optional[str] = None
    department_name: Optional[str] = None
    description: Optional[str] = None
    manager: Optional[str] = None


class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }
    