"""
app/routers/attendance.py

Attendance API Routes.
"""

from typing import List

from fastapi import (
    APIRouter,
    Depends,
    Path,
    status,
)
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
    summary="Create Attendance",
    description="Mark attendance for an employee.",
    response_description="Attendance created successfully.",
)
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    return create_attendance(
        db=db,
        attendance=attendance,
        user_id=current_user.id,
    )


@router.get(
    "",
    response_model=List[AttendanceResponse],
    summary="Get All Attendance",
    description="Retrieve all attendance records.",
)
def list_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    return get_all_attendance(db)


@router.get(
    "/{attendance_id}",
    response_model=AttendanceResponse,
    summary="Get Attendance by ID",
)
def attendance_detail(
    attendance_id: int = Path(
        ...,
        gt=0,
        description="Attendance ID",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    return get_attendance_by_id(
        db=db,
        attendance_id=attendance_id,
    )


@router.get(
    "/employee/{employee_id}",
    response_model=List[AttendanceResponse],
    summary="Get Employee Attendance",
)
def employee_attendance(
    employee_id: int = Path(
        ...,
        gt=0,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    ),
):
    return get_attendance_by_employee(
        db=db,
        employee_id=employee_id,
    )


@router.put(
    "/{attendance_id}",
    response_model=AttendanceResponse,
    summary="Update Attendance",
)
def edit_attendance(
    attendance_id: int = Path(
        ...,
        gt=0,
    ),
    attendance: AttendanceUpdate = ...,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    return update_attendance(
        db=db,
        attendance_id=attendance_id,
        attendance_data=attendance,
        user_id=current_user.id,
    )


@router.delete(
    "/{attendance_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Attendance",
)
def remove_attendance(
    attendance_id: int = Path(
        ...,
        gt=0,
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
        )
    ),
):
    return delete_attendance(
        db=db,
        attendance_id=attendance_id,
        user_id=current_user.id,
    )