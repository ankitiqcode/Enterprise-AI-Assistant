"""
app/routers/employees.py

Employee management endpoints.
"""

from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeResponse,
    EmployeeUpdate,
)
from app.services.employee_service import (
    create_employee,
    delete_employee,
    get_all_employees,
    get_employee_by_id,
    update_employee,
)

router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


# ==========================================================
# Create Employee
# ==========================================================

@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_employee(
    employee: EmployeeCreate,
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
    Create a new employee.

    Allowed roles:
    - Admin
    - HR
    - Manager
    """

    return create_employee(
        db=db,
        employee=employee,
        user_id=current_user.id,
    )


# ==========================================================
# Get All Employees
# ==========================================================

@router.get(
    "",
    response_model=List[EmployeeResponse],
)
def list_employees(
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
    Get all employees.

    Allowed roles:
    - Admin
    - HR
    - Manager
    - Employee
    """

    return get_all_employees(db)


# ==========================================================
# Get Employee By ID
# ==========================================================

@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def get_employee(
    employee_id: int,
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
    Get employee details.

    Allowed roles:
    - Admin
    - HR
    - Manager
    - Employee
    """

    return get_employee_by_id(
        db,
        employee_id,
    )


# ==========================================================
# Update Employee
# ==========================================================

@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def edit_employee(
    employee_id: int,
    employee: EmployeeUpdate,
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
    Update employee details.

    Allowed roles:
    - Admin
    - HR
    - Manager
    """

    return update_employee(
        db=db,
        employee_id=employee_id,
        employee_data=employee,
        user_id=current_user.id,
    )


# ==========================================================
# Delete Employee
# ==========================================================

@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_200_OK,
)
def remove_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles("admin")
    ),
):
    """
    Delete an employee.

    Only Admin can delete employees.
    """

    return delete_employee(
        db=db,
        employee_id=employee_id,
        user_id=current_user.id,
    )