"""
app/routers/departments.py

Department management endpoints with role-based access control.
"""

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


# ==========================================================
# Create Department
# ==========================================================

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
            "manager",
        )
    ),
):
    """
    Create a new department.

    Allowed:
    - Admin
    - HR
    - Manager
    """

    return create_department(
        db=db,
        department=department,
        user_id=current_user.id,
    )


# ==========================================================
# Get All Departments
# ==========================================================

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

    All authenticated roles can view departments.
    """

    return get_all_departments(db)


# ==========================================================
# Get Department By ID
# ==========================================================

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
    Get department details.

    All authenticated roles can view department details.
    """

    return get_department_by_id(
        db=db,
        department_id=department_id,
    )


# ==========================================================
# Update Department
# ==========================================================

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
            "manager",
        )
    ),
):
    """
    Update department.

    Allowed:
    - Admin
    - HR
    - Manager
    """

    return update_department(
        db=db,
        department_id=department_id,
        department_data=department,
        user_id=current_user.id,
    )


# ==========================================================
# Delete Department
# ==========================================================

@router.delete(
    "/{department_id}",
    status_code=status.HTTP_200_OK,
)
def remove_department(
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin")
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