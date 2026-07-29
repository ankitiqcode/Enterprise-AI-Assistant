"""
app/services/audit_log_service.py

Audit Log Service.
"""

from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


def log_action(
    db: Session,
    *,
    user_id: int,
    module: str,
    action: str,
    description: str | None = None,
    ip_address: str | None = None,
) -> AuditLog:
    """
    Save an audit log entry.
    """

    log = AuditLog(
        user_id=user_id,
        module=module,
        action=action,
        description=description,
        ip_address=ip_address,
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


def get_logs(
    db: Session,
):
    """
    Return all audit logs ordered by newest first.
    """

    return (
        db.query(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .all()
    )