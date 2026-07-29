"""
app/services/attendance_service.py

Business logic for Attendance Management.
"""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate
from app.services.audit_log_service import log_action


def create_attendance(
    db: Session,
    attendance: AttendanceCreate,
    user_id: int,
) -> Attendance:
    """
    Create a new attendance record.
    """

    employee = (
        db.query(Employee)
        .filter(Employee.id == attendance.employee_id)
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == attendance.employee_id,
            Attendance.attendance_date == attendance.attendance_date,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Attendance already exists for this employee on this date.",
        )

    attendance_obj = Attendance(**attendance.model_dump())

    try:
        db.add(attendance_obj)
        db.commit()
        db.refresh(attendance_obj)

        log_action(
            db=db,
            user_id=user_id,
            module="Attendance",
            action="Create",
            description=(
                f"Attendance marked for Employee ID "
                f"{attendance_obj.employee_id}"
            ),
        )

        return attendance_obj

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create attendance.",
        )


def get_all_attendance(
    db: Session,
) -> list[Attendance]:
    """
    Return all attendance records.
    """

    return (
        db.query(Attendance)
        .order_by(
            Attendance.attendance_date.desc(),
        )
        .all()
    )


def get_attendance_by_id(
    db: Session,
    attendance_id: int,
) -> Attendance:
    """
    Return attendance by ID.
    """

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.id == attendance_id,
        )
        .first()
    )

    if attendance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance not found.",
        )

    return attendance


def get_attendance_by_employee(
    db: Session,
    employee_id: int,
) -> list[Attendance]:
    """
    Return all attendance records of an employee.
    """

    return (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == employee_id,
        )
        .order_by(
            Attendance.attendance_date.desc(),
        )
        .all()
    )


def update_attendance(
    db: Session,
    attendance_id: int,
    attendance_data: AttendanceUpdate,
    user_id: int,
) -> Attendance:
    """
    Update attendance record.
    """

    attendance = get_attendance_by_id(
        db,
        attendance_id,
    )

    update_data = attendance_data.model_dump(
        exclude_unset=True,
    )

    check_in = update_data.get(
        "check_in",
        attendance.check_in,
    )

    check_out = update_data.get(
        "check_out",
        attendance.check_out,
    )

    if (
        check_in is not None
        and check_out is not None
        and check_out <= check_in
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Check-out time must be later than check-in time.",
        )

    for key, value in update_data.items():
        setattr(
            attendance,
            key,
            value,
        )

    try:
        db.commit()
        db.refresh(attendance)

        log_action(
            db=db,
            user_id=user_id,
            module="Attendance",
            action="Update",
            description=(
                f"Updated attendance ID {attendance.id}"
            ),
        )

        return attendance

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update attendance.",
        )


def delete_attendance(
    db: Session,
    attendance_id: int,
    user_id: int,
) -> dict[str, str]:
    """
    Delete attendance record.
    """

    attendance = get_attendance_by_id(
        db,
        attendance_id,
    )

    try:
        log_action(
            db=db,
            user_id=user_id,
            module="Attendance",
            action="Delete",
            description=(
                f"Deleted attendance ID {attendance.id}"
            ),
        )

        db.delete(attendance)
        db.commit()

        return {
            "message": "Attendance deleted successfully."
        }

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete attendance.",
        )