"""
app/schemas/audit_log.py

Schemas for Audit Logs.
"""

from datetime import datetime

from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: int
    user_id: int
    module: str
    action: str
    description: str | None = None
    ip_address: str | None = None
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }