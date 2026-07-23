from datetime import date

from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.department import Department
from app.models.attendance import Attendance
from app.models.leave import Leave


def get_dashboard_summary(db: Session):
    today = date.today()

    total_employees = db.query(Employee).count()

    total_departments = db.query(Department).count()

    present_today = (
        db.query(Attendance)
        .filter(
            Attendance.attendance_date == today,
            Attendance.status == "Present",
        )
        .count()
    )

    absent_today = (
        db.query(Attendance)
        .filter(
            Attendance.attendance_date == today,
            Attendance.status == "Absent",
        )
        .count()
    )

    pending_leaves = (
        db.query(Leave)
        .filter(
            Leave.status == "Pending",
        )
        .count()
    )

    approved_leaves = (
        db.query(Leave)
        .filter(
            Leave.status == "Approved",
        )
        .count()
    )

    return {
        "total_employees": total_employees,
        "total_departments": total_departments,
        "present_today": present_today,
        "absent_today": absent_today,
        "pending_leaves": pending_leaves,
        "approved_leaves": approved_leaves,
    }