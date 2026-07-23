from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
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


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    """
    Create a new employee.
    Only Admin and HR can create employees.
    """
    return create_employee(db, employee)


@router.get(
    "",
    response_model=List[EmployeeResponse],
)
def list_employees(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    """
    Get all employees.
    Only Admin and HR can view employee list.
    """
    return get_all_employees(db)


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    """
    Get employee by ID.
    Only Admin and HR can access employee details.
    """
    return get_employee_by_id(db, employee_id)


@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse,
)
def edit_employee(
    employee_id: int,
    employee: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin", "hr")),
):
    """
    Update employee details.
    Only Admin and HR can update employees.
    """
    return update_employee(db, employee_id, employee)


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_200_OK,
)
def remove_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    """
    Delete an employee.
    Only Admin can delete employees.
    """
    return delete_employee(db, employee_id)