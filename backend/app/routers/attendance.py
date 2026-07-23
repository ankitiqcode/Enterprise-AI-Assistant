from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceResponse,
    AttendanceUpdate,
)
from app.services.attendance_service import (
    create_attendance,
    delete_attendance,
    get_all_attendance,
    get_attendance_by_employee,
    get_attendance_by_id,
    update_attendance,
)

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
)
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    return create_attendance(db, attendance)


@router.get(
    "",
    response_model=List[AttendanceResponse],
)
def list_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    return get_all_attendance(db)


@router.get(
    "/{attendance_id}",
    response_model=AttendanceResponse,
)
def attendance_detail(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    return get_attendance_by_id(db, attendance_id)


@router.get(
    "/employee/{employee_id}",
    response_model=List[AttendanceResponse],
)
def employee_attendance(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr", "employee")),
):
    return get_attendance_by_employee(db, employee_id)


@router.put(
    "/{attendance_id}",
    response_model=AttendanceResponse,
)
def edit_attendance(
    attendance_id: int,
    attendance: AttendanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    return update_attendance(
        db,
        attendance_id,
        attendance,
    )


@router.delete(
    "/{attendance_id}",
    status_code=status.HTTP_200_OK,
)
def remove_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    return delete_attendance(
        db,
        attendance_id,
    )