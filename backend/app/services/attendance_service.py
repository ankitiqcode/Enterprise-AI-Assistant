from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
)


def create_attendance(
    db: Session,
    attendance: AttendanceCreate,
):
    # Check if employee exists
    employee = (
        db.query(Employee)
        .filter(Employee.id == attendance.employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    # Prevent duplicate attendance for same employee on same date
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
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this employee on this date.",
        )

    new_attendance = Attendance(**attendance.model_dump())

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


def get_all_attendance(db: Session):
    return db.query(Attendance).all()


def get_attendance_by_id(
    db: Session,
    attendance_id: int,
):
    attendance = (
        db.query(Attendance)
        .filter(Attendance.id == attendance_id)
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance not found",
        )

    return attendance


def get_attendance_by_employee(
    db: Session,
    employee_id: int,
):
    return (
        db.query(Attendance)
        .filter(Attendance.employee_id == employee_id)
        .all()
    )


def update_attendance(
    db: Session,
    attendance_id: int,
    attendance_data: AttendanceUpdate,
):
    attendance = get_attendance_by_id(
        db,
        attendance_id,
    )

    update_data = attendance_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(attendance, key, value)

    db.commit()
    db.refresh(attendance)

    return attendance


def delete_attendance(
    db: Session,
    attendance_id: int,
):
    attendance = get_attendance_by_id(
        db,
        attendance_id,
    )

    db.delete(attendance)
    db.commit()

    return {
        "message": "Attendance deleted successfully"
    }