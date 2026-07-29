"""
app/routers/dashboard.py

Dashboard API routes.
"""

from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardSummary
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/summary",
    response_model=DashboardSummary,
    summary="Dashboard Summary",
    description="Returns overall employee, department, attendance, and leave statistics.",
)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
) -> DashboardSummary:
    """
    Get dashboard summary statistics.
    """

    return get_dashboard_summary(db)