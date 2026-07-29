"""
app/routers/leave.py

Leave Management API Routes.
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
from app.schemas.leave import (
    LeaveCreate,
    LeaveResponse,
    LeaveUpdate,
)
from app.services.leave_service import (
    apply_leave,
    approve_leave,
    delete_leave,
    get_all_leaves,
    get_leave_by_id,
    get_leaves_by_employee,
    reject_leave,
    update_leave,
)

router = APIRouter(
    prefix="/leave",
    tags=["Leave Management"],
)


@router.post(
    "",
    response_model=LeaveResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Apply Leave",
)
def create_leave(
    leave: LeaveCreate,
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
    """
    Apply for leave.
    """
    return apply_leave(
        db=db,
        leave=leave,
        user_id=current_user.id,
    )


@router.get(
    "",
    response_model=List[LeaveResponse],
    summary="Get All Leave Requests",
)
def list_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    View all leave requests.
    """
    return get_all_leaves(db)


@router.get(
    "/{leave_id}",
    response_model=LeaveResponse,
    summary="Get Leave By ID",
)
def get_leave(
    leave_id: int = Path(..., gt=0),
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
    """
    Get leave details by ID.
    """
    return get_leave_by_id(
        db=db,
        leave_id=leave_id,
    )


@router.get(
    "/employee/{employee_id}",
    response_model=List[LeaveResponse],
    summary="Get Employee Leave History",
)
def employee_leave_history(
    employee_id: int = Path(..., gt=0),
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
    """
    Get leave history of an employee.
    """
    return get_leaves_by_employee(
        db=db,
        employee_id=employee_id,
    )


@router.put(
    "/{leave_id}",
    response_model=LeaveResponse,
    summary="Update Leave",
)
def edit_leave(
    leave_id: int = Path(..., gt=0),
    leave: LeaveUpdate = ...,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Update leave request.
    """
    return update_leave(
        db=db,
        leave_id=leave_id,
        leave_data=leave,
        user_id=current_user.id,
    )


@router.patch(
    "/{leave_id}/approve",
    response_model=LeaveResponse,
    summary="Approve Leave",
)
def approve_leave_request(
    leave_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Approve a leave request.
    """
    return approve_leave(
        db=db,
        leave_id=leave_id,
        user_id=current_user.id,
    )


@router.patch(
    "/{leave_id}/reject",
    response_model=LeaveResponse,
    summary="Reject Leave",
)
def reject_leave_request(
    leave_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Reject a leave request.
    """
    return reject_leave(
        db=db,
        leave_id=leave_id,
        user_id=current_user.id,
    )


@router.delete(
    "/{leave_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete Leave",
)
def remove_leave(
    leave_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
        )
    ),
):
    """
    Delete a leave request.
    Only Admin can delete leave records.
    """
    return delete_leave(
        db=db,
        leave_id=leave_id,
        user_id=current_user.id,
    )