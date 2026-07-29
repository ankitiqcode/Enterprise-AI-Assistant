"""
app/schemas/dashboard.py

Pydantic schemas for Dashboard APIs.
"""

from pydantic import BaseModel, ConfigDict


class DashboardSummary(BaseModel):
    total_employees: int
    total_departments: int

    present_today: int
    absent_today: int

    pending_leaves: int
    approved_leaves: int
    rejected_leaves: int

    model_config = ConfigDict(
        from_attributes=True,
    )