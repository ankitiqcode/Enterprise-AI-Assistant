"""
app/routers/audit_log.py

Audit Log API.
"""

from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.audit_log import AuditLogResponse
from app.services.audit_log_service import get_logs

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"],
)


@router.get(
    "",
    response_model=List[AuditLogResponse],
)
def list_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
        )
    ),
):
    """
    Return all audit logs.
    """

    return get_logs(db)