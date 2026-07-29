"""
app/models/leave.py

Leave model for Employee Leave Management.
"""

from __future__ import annotations

import enum
from datetime import date, datetime

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class LeaveStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    CANCELLED = "Cancelled"


class Leave(Base):
    __tablename__ = "leaves"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey(
            "employees.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    leave_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    status: Mapped[LeaveStatus] = mapped_column(
        Enum(
            LeaveStatus,
            values_callable=lambda enum_cls: [
                item.value for item in enum_cls
            ],
            name="leave_status",
        ),
        nullable=False,
        default=LeaveStatus.PENDING,
    )

    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    employee = relationship(
        "Employee",
        back_populates="leave_records",
    )

    def __repr__(self) -> str:
        return (
            f"<Leave("
            f"id={self.id}, "
            f"employee_id={self.employee_id}, "
            f"status={self.status.value}"
            f")>"
        )