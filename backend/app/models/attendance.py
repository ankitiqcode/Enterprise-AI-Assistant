"""
app/models/attendance.py

Attendance model for employee daily attendance records.

Features:
- One attendance record per employee per day.
- Supports check-in and check-out.
- Attendance status tracking.
- Automatic timestamps.
"""

from __future__ import annotations

import enum
from datetime import date, datetime, time

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Time,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"
    LEAVE = "Leave"
    HALF_DAY = "Half-Day"
    WFH = "WFH"


class Attendance(Base):
    __tablename__ = "attendance"

    __table_args__ = (
        UniqueConstraint(
            "employee_id",
            "attendance_date",
            name="uq_employee_attendance_date",
        ),
    )

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

    attendance_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )

    check_in: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    check_out: Mapped[time | None] = mapped_column(
        Time,
        nullable=True,
    )

    status: Mapped[AttendanceStatus] = mapped_column(
        Enum(
            AttendanceStatus,
            values_callable=lambda enum_cls: [
                item.value for item in enum_cls
            ],
            name="attendance_status",
        ),
        nullable=False,
        default=AttendanceStatus.PRESENT,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    employee = relationship(
        "Employee",
        back_populates="attendance_records",
    )

    def __repr__(self) -> str:
        return (
            f"<Attendance("
            f"id={self.id}, "
            f"employee_id={self.employee_id}, "
            f"date={self.attendance_date}, "
            f"status={self.status.value}"
            f")>"
        )