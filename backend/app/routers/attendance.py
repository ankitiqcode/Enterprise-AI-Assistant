"""
app/routers/attendance.py

Attendance API routes with role-based access control.
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


# ==========================================================
# Create / Mark Attendance
# ==========================================================

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
            "manager",
        )
    ),
):
    """
    Mark attendance.

    Allowed roles:
    - Admin
    - HR
    - Manager
    """

    return create_attendance(
        db=db,
        attendance=attendance,
        user_id=current_user.id,
    )


# ==========================================================
# Get All Attendance
# ==========================================================

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
            "manager",
        )
    ),
):
    """
    Get all attendance records.

    Allowed roles:
    - Admin
    - HR
    - Manager
    """

    return get_all_attendance(db)


# ==========================================================
# Get Attendance By ID
# ==========================================================

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
            "manager",
        )
    ),
):
    """
    Get a single attendance record.

    Allowed roles:
    - Admin
    - HR
    - Manager
    """

    return get_attendance_by_id(
        db=db,
        attendance_id=attendance_id,
    )


# ==========================================================
# Get Employee Attendance
# ==========================================================

@router.get(
    "/employee/{employee_id}",
    response_model=List[AttendanceResponse],
    summary="Get Employee Attendance",
)
def employee_attendance(
    employee_id: int = Path(
        ...,
        gt=0,
        description="Employee ID",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
        )
    ),
):
    """
    Get attendance records for a specific employee.

    Allowed roles:
    - Admin
    - HR
    - Manager
    """

    return get_attendance_by_employee(
        db=db,
        employee_id=employee_id,
    )


# ==========================================================
# Update Attendance
# ==========================================================

@router.put(
    "/{attendance_id}",
    response_model=AttendanceResponse,
    summary="Update Attendance",
)
def edit_attendance(
    attendance_id: int = Path(
        ...,
        gt=0,
        description="Attendance ID",
    ),
    attendance: AttendanceUpdate = ...,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
        )
    ),
):
    """
    Update attendance.

    Allowed roles:
    - Admin
    - HR
    - Manager
    """

    return update_attendance(
        db=db,
        attendance_id=attendance_id,
        attendance_data=attendance,
        user_id=current_user.id,
    )


# ==========================================================
# Delete Attendance
# ==========================================================

@router.delete(
    "/{attendance_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Attendance",
)
def remove_attendance(
    attendance_id: int = Path(
        ...,
        gt=0,
        description="Attendance ID",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin")
    ),
):
    """
    Delete attendance.

    Only Admin can delete attendance.
    """

    return delete_attendance(
        db=db,
        attendance_id=attendance_id,
        user_id=current_user.id,
    )