from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_employees: int
    total_departments: int
    present_today: int
    absent_today: int
    pending_leaves: int
    approved_leaves: int