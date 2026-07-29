from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.department import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
)
from app.services.department_service import (
    create_department,
    delete_department,
    get_all_departments,
    get_department_by_id,
    update_department,
)

router = APIRouter(
    prefix="/departments",
    tags=["Departments"],
)


@router.post(
    "",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Create a new department.
    Only Admin and HR can create departments.
    """

    return create_department(
        db=db,
        department=department,
        user_id=current_user.id,
    )


@router.get(
    "",
    response_model=List[DepartmentResponse],
)
def list_departments(
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
    Get all departments.
    """

    return get_all_departments(db)


@router.get(
    "/{department_id}",
    response_model=DepartmentResponse,
)
def get_department(
    department_id: int,
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
    Get department by ID.
    """

    return get_department_by_id(
        db=db,
        department_id=department_id,
    )


@router.put(
    "/{department_id}",
    response_model=DepartmentResponse,
)
def edit_department(
    department_id: int,
    department: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
        )
    ),
):
    """
    Update department.
    Only Admin and HR can update departments.
    """

    return update_department(
        db=db,
        department_id=department_id,
        department_data=department,
        user_id=current_user.id,
    )


@router.delete(
    "/{department_id}",
    status_code=status.HTTP_200_OK,
)
def remove_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
        )
    ),
):
    """
    Delete department.
    Only Admin can delete departments.
    """

    return delete_department(
        db=db,
        department_id=department_id,
        user_id=current_user.id,
    )