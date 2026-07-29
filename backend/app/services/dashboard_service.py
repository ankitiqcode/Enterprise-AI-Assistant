"""
app/services/dashboard_service.py

Business logic for Dashboard analytics.
"""

from __future__ import annotations

from datetime import date

from sqlalchemy.orm import Session

from app.models.attendance import Attendance, AttendanceStatus
from app.models.department import Department
from app.models.employee import Employee
from app.models.leave import Leave, LeaveStatus
from app.schemas.dashboard import DashboardSummary


def get_dashboard_summary(
    db: Session,
) -> DashboardSummary:
    """
    Return dashboard summary statistics.
    """

    today = date.today()

    total_employees = (
        db.query(Employee)
        .count()
    )

    total_departments = (
        db.query(Department)
        .count()
    )

    present_today = (
        db.query(Attendance)
        .filter(
            Attendance.attendance_date == today,
            Attendance.status == AttendanceStatus.PRESENT,
        )
        .count()
    )

    absent_today = (
        db.query(Attendance)
        .filter(
            Attendance.attendance_date == today,
            Attendance.status == AttendanceStatus.ABSENT,
        )
        .count()
    )

    pending_leaves = (
        db.query(Leave)
        .filter(
            Leave.status == LeaveStatus.PENDING,
        )
        .count()
    )

    approved_leaves = (
        db.query(Leave)
        .filter(
            Leave.status == LeaveStatus.APPROVED,
        )
        .count()
    )

    rejected_leaves = (
        db.query(Leave)
        .filter(
            Leave.status == LeaveStatus.REJECTED,
        )
        .count()
    )

    return DashboardSummary(
        total_employees=total_employees,
        total_departments=total_departments,
        present_today=present_today,
        absent_today=absent_today,
        pending_leaves=pending_leaves,
        approved_leaves=approved_leaves,
        rejected_leaves=rejected_leaves,
    )