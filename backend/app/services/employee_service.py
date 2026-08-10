"""
app/services/employee_service.py

Service layer for employee management:
create, read, update, and delete employees.

When an employee is created, a corresponding employee
login account is also created in the users table.
"""

import secrets
import string

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.employee import Employee
from app.models.user import User
from app.schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
)
from app.services.audit_log_service import log_action


# ==========================================================
# Temporary Employee Password
# ==========================================================

def generate_temporary_password(length: int = 12) -> str:
    """
    Generate a random temporary password for a new employee.

    The password is only generated during account creation.
    """

    characters = (
        string.ascii_letters
        + string.digits
        + "@#$%!"
    )

    return "".join(
        secrets.choice(characters)
        for _ in range(length)
    )


# ==========================================================
# Create Employee
# ==========================================================

def create_employee(
    db: Session,
    employee: EmployeeCreate,
    user_id: int,
) -> Employee:
    """
    Create a new employee and automatically create
    an employee login account.

    Checks:
    - Employee ID must be unique.
    - Employee email must be unique.
    - User email must be unique.
    """

    # ------------------------------------------------------
    # Check Employee ID
    # ------------------------------------------------------

    existing_employee = (
        db.query(Employee)
        .filter(
            Employee.employee_id
            == employee.employee_id
        )
        .first()
    )

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already exists",
        )

    # ------------------------------------------------------
    # Check Employee Email
    # ------------------------------------------------------

    existing_employee_email = (
        db.query(Employee)
        .filter(
            Employee.email
            == employee.email
        )
        .first()
    )

    if existing_employee_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee email already exists",
        )

    # ------------------------------------------------------
    # Check User Email
    # ------------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email
            == employee.email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "A login account already exists "
                "with this email"
            ),
        )

    # ------------------------------------------------------
    # Create Employee
    # ------------------------------------------------------

    new_employee = Employee(
        **employee.model_dump()
    )

    # ------------------------------------------------------
    # Generate Employee Login Password
    # ------------------------------------------------------

    temporary_password = (
        generate_temporary_password()
    )

    # ------------------------------------------------------
    # Create Employee User Account
    # ------------------------------------------------------

    employee_name = (
        f"{employee.first_name} "
        f"{employee.last_name}"
    ).strip()

    new_user = User(
        name=employee_name,
        email=str(employee.email),
        password=hash_password(
            temporary_password
        ),
        role="employee",
    )

    # ------------------------------------------------------
    # Save Both Records
    # ------------------------------------------------------

    try:
        db.add(new_employee)
        db.add(new_user)

        # One transaction for both records
        db.commit()

        db.refresh(new_employee)
        db.refresh(new_user)

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Employee creation failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "Failed to create employee "
                "and login account"
            ),
        )

    # ------------------------------------------------------
    # Show Temporary Credentials
    # ------------------------------------------------------

    print("\n" + "=" * 60)
    print("EMPLOYEE LOGIN ACCOUNT CREATED")
    print("=" * 60)
    print("Employee Name :", employee_name)
    print("Email         :", employee.email)
    print("Role          : employee")
    print(
        "Temporary Password :",
        temporary_password,
    )
    print("=" * 60 + "\n")

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Employee",
        action="Create",
        description=(
            f"Created employee: "
            f"{new_employee.first_name} "
            f"{new_employee.last_name} "
            f"and employee login account"
        ),
    )

    return new_employee


# ==========================================================
# Get All Employees
# ==========================================================

def get_all_employees(
    db: Session,
):
    """
    Return all employees.
    """

    return (
        db.query(Employee)
        .order_by(Employee.id.desc())
        .all()
    )


# ==========================================================
# Get Employee By ID
# ==========================================================

def get_employee_by_id(
    db: Session,
    employee_id: int,
):
    """
    Return a single employee by database ID.
    """

    employee = (
        db.query(Employee)
        .filter(
            Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    return employee


# ==========================================================
# Update Employee
# ==========================================================

def update_employee(
    db: Session,
    employee_id: int,
    employee_data: EmployeeUpdate,
    user_id: int,
):
    """
    Update an existing employee.

    If employee email changes, the corresponding
    employee login email is also updated.
    """

    employee = get_employee_by_id(
        db,
        employee_id,
    )

    # ------------------------------------------------------
    # Get only fields sent by client
    # ------------------------------------------------------

    update_data = employee_data.model_dump(
        exclude_unset=True
    )

    # ------------------------------------------------------
    # Check Email Uniqueness
    # ------------------------------------------------------

    if "email" in update_data:

        new_email = update_data["email"]

        # Employee table check
        existing_employee = (
            db.query(Employee)
            .filter(
                Employee.email == new_email,
                Employee.id != employee_id,
            )
            .first()
        )

        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee email already exists",
            )

        # User table check
        existing_user = (
            db.query(User)
            .filter(
                User.email == new_email,
            )
            .first()
        )

        # Allow the employee's own user account
        current_user_account = (
            db.query(User)
            .filter(
                User.email == employee.email
            )
            .first()
        )

        if (
            existing_user
            and existing_user.id
            != (
                current_user_account.id
                if current_user_account
                else None
            )
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "A login account already exists "
                    "with this email"
                ),
            )

    # ------------------------------------------------------
    # Update Employee
    # ------------------------------------------------------

    old_email = employee.email

    for key, value in update_data.items():
        setattr(
            employee,
            key,
            value,
        )

    # ------------------------------------------------------
    # Sync Employee Login Account
    # ------------------------------------------------------

    employee_user = (
        db.query(User)
        .filter(
            User.email == old_email
        )
        .first()
    )

    if employee_user:

        # Keep employee name synchronized
        if (
            "first_name" in update_data
            or "last_name" in update_data
        ):
            employee_user.name = (
                f"{employee.first_name} "
                f"{employee.last_name}"
            ).strip()

        # Keep employee email synchronized
        if "email" in update_data:
            employee_user.email = str(
                update_data["email"]
            )

    # ------------------------------------------------------
    # Commit
    # ------------------------------------------------------

    try:
        db.commit()
        db.refresh(employee)

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Employee update failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update employee",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Employee",
        action="Update",
        description=(
            f"Updated employee: "
            f"{employee.first_name} "
            f"{employee.last_name}"
        ),
    )

    return employee


# ==========================================================
# Delete Employee
# ==========================================================

def delete_employee(
    db: Session,
    employee_id: int,
    user_id: int,
):
    """
    Delete an employee.

    The employee login account is intentionally NOT
    deleted automatically. This avoids accidentally
    deleting authentication data before a proper
    account-deactivation workflow is implemented.
    """

    employee = get_employee_by_id(
        db,
        employee_id,
    )

    # ------------------------------------------------------
    # Save Employee Name
    # ------------------------------------------------------

    employee_name = (
        f"{employee.first_name} "
        f"{employee.last_name}"
    )

    # ------------------------------------------------------
    # Delete Employee
    # ------------------------------------------------------

    try:
        db.delete(employee)
        db.commit()

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Employee deletion failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete employee",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Employee",
        action="Delete",
        description=(
            f"Deleted employee: "
            f"{employee_name}"
        ),
    )

    return {
        "message": "Employee deleted successfully"
    }