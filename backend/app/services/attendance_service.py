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
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
)
from app.services.audit_log_service import log_action


# ==========================================================
# Create Attendance
# ==========================================================

def create_attendance(
    db: Session,
    attendance: AttendanceCreate,
    user_id: int,
) -> Attendance:
    """
    Create a new attendance record.

    Checks:
    - Employee must exist.
    - Only one attendance record per employee per date.
    - Check-out must be later than check-in.
    """

    # ------------------------------------------------------
    # Check Employee
    # ------------------------------------------------------

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == attendance.employee_id
        )
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    # ------------------------------------------------------
    # Check Duplicate Attendance
    # ------------------------------------------------------

    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id
            == attendance.employee_id,
            Attendance.attendance_date
            == attendance.attendance_date,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Attendance already exists for "
                "this employee on this date."
            ),
        )

    # ------------------------------------------------------
    # Validate Check-in / Check-out
    # ------------------------------------------------------

    if (
        attendance.check_in is not None
        and attendance.check_out is not None
        and attendance.check_out
        <= attendance.check_in
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Check-out time must be later "
                "than check-in time."
            ),
        )

    # ------------------------------------------------------
    # Create Attendance Object
    # ------------------------------------------------------

    attendance_obj = Attendance(
        **attendance.model_dump()
    )

    try:
        db.add(attendance_obj)

        db.commit()

        db.refresh(attendance_obj)

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Attendance creation failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create attendance.",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Attendance",
        action="Create",
        description=(
            f"Attendance marked for "
            f"Employee ID "
            f"{attendance_obj.employee_id}"
        ),
    )

    return attendance_obj


# ==========================================================
# Get All Attendance
# ==========================================================

def get_all_attendance(
    db: Session,
) -> list[Attendance]:
    """
    Return all attendance records.
    """

    return (
        db.query(Attendance)
        .order_by(
            Attendance.attendance_date.desc()
        )
        .all()
    )


# ==========================================================
# Get Attendance By ID
# ==========================================================

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
            Attendance.id == attendance_id
        )
        .first()
    )

    if attendance is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance not found.",
        )

    return attendance


# ==========================================================
# Get Attendance By Employee
# ==========================================================

def get_attendance_by_employee(
    db: Session,
    employee_id: int,
) -> list[Attendance]:
    """
    Return all attendance records
    belonging to an employee.
    """

    # ------------------------------------------------------
    # Check Employee Exists
    # ------------------------------------------------------

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    return (
        db.query(Attendance)
        .filter(
            Attendance.employee_id
            == employee_id
        )
        .order_by(
            Attendance.attendance_date.desc()
        )
        .all()
    )


# ==========================================================
# Update Attendance
# ==========================================================

def update_attendance(
    db: Session,
    attendance_id: int,
    attendance_data: AttendanceUpdate,
    user_id: int,
) -> Attendance:
    """
    Update an attendance record.

    Validates:
    - Employee existence when employee_id changes.
    - Duplicate employee/date combinations.
    - Check-in/check-out time.
    """

    attendance = get_attendance_by_id(
        db,
        attendance_id,
    )

    # ------------------------------------------------------
    # Get Submitted Fields
    # ------------------------------------------------------

    update_data = attendance_data.model_dump(
        exclude_unset=True,
    )

    # ------------------------------------------------------
    # Determine Final Values
    # ------------------------------------------------------

    final_employee_id = update_data.get(
        "employee_id",
        attendance.employee_id,
    )

    final_attendance_date = update_data.get(
        "attendance_date",
        attendance.attendance_date,
    )

    final_check_in = update_data.get(
        "check_in",
        attendance.check_in,
    )

    final_check_out = update_data.get(
        "check_out",
        attendance.check_out,
    )

    # ------------------------------------------------------
    # Check Employee
    # ------------------------------------------------------

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == final_employee_id
        )
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    # ------------------------------------------------------
    # Check Duplicate Attendance
    # ------------------------------------------------------

    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id
            == final_employee_id,
            Attendance.attendance_date
            == final_attendance_date,
            Attendance.id != attendance_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Attendance already exists for "
                "this employee on this date."
            ),
        )

    # ------------------------------------------------------
    # Validate Check-in / Check-out
    # ------------------------------------------------------

    if (
        final_check_in is not None
        and final_check_out is not None
        and final_check_out
        <= final_check_in
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Check-out time must be later "
                "than check-in time."
            ),
        )

    # ------------------------------------------------------
    # Update Fields
    # ------------------------------------------------------

    for key, value in update_data.items():
        setattr(
            attendance,
            key,
            value,
        )

    # ------------------------------------------------------
    # Save Changes
    # ------------------------------------------------------

    try:
        db.commit()

        db.refresh(attendance)

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Attendance update failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update attendance.",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Attendance",
        action="Update",
        description=(
            f"Updated attendance ID "
            f"{attendance.id}"
        ),
    )

    return attendance


# ==========================================================
# Delete Attendance
# ==========================================================

def delete_attendance(
    db: Session,
    attendance_id: int,
    user_id: int,
) -> dict[str, str]:
    """
    Delete an attendance record.

    Only the router-level permission allows Admin
    to call this operation.
    """

    attendance = get_attendance_by_id(
        db,
        attendance_id,
    )

    # ------------------------------------------------------
    # Save ID Before Delete
    # ------------------------------------------------------

    attendance_id_value = attendance.id

    try:
        db.delete(attendance)

        db.commit()

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Attendance deletion failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete attendance.",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Attendance",
        action="Delete",
        description=(
            f"Deleted attendance ID "
            f"{attendance_id_value}"
        ),
    )

    return {
        "message": "Attendance deleted successfully."
    }