from typing import List

from fastapi import APIRouter, Depends, status
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
    delete_leave,
    get_all_leaves,
    get_leave_by_id,
    get_leaves_by_employee,
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
)
def create_leave(
    leave: LeaveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin", "hr", "employee")
    ),
):
    return apply_leave(db, leave)


@router.get(
    "",
    response_model=List[LeaveResponse],
)
def list_leaves(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin", "hr")
    ),
):
    return get_all_leaves(db)


@router.get(
    "/{leave_id}",
    response_model=LeaveResponse,
)
def get_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin", "hr", "employee")
    ),
):
    return get_leave_by_id(db, leave_id)


@router.get(
    "/employee/{employee_id}",
    response_model=List[LeaveResponse],
)
def employee_leave_history(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin", "hr", "employee")
    ),
):
    return get_leaves_by_employee(
        db,
        employee_id,
    )


@router.put(
    "/{leave_id}",
    response_model=LeaveResponse,
)
def edit_leave(
    leave_id: int,
    leave: LeaveUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin", "hr")
    ),
):
    return update_leave(
        db,
        leave_id,
        leave,
    )


@router.delete(
    "/{leave_id}",
    status_code=status.HTTP_200_OK,
)
def remove_leave(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin")
    ),
):
    return delete_leave(
        db,
        leave_id,
    )