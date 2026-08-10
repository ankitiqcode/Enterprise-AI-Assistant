"""
app/services/department_service.py

Service layer for department management:
create, read, update, and delete departments.
"""

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.department import Department
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)
from app.services.audit_log_service import log_action


# ==========================================================
# Create Department
# ==========================================================

def create_department(
    db: Session,
    department: DepartmentCreate,
    user_id: int,
) -> Department:
    """
    Create a new department.

    Checks:
    - Department code must be unique.
    - Department name must be unique.
    """

    # ------------------------------------------------------
    # Check Duplicate Department Code
    # ------------------------------------------------------

    existing_code = (
        db.query(Department)
        .filter(
            Department.department_code
            == department.department_code
        )
        .first()
    )

    if existing_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department code already exists",
        )

    # ------------------------------------------------------
    # Check Duplicate Department Name
    # ------------------------------------------------------

    existing_name = (
        db.query(Department)
        .filter(
            Department.department_name
            == department.department_name
        )
        .first()
    )

    if existing_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department name already exists",
        )

    # ------------------------------------------------------
    # Create Department
    # ------------------------------------------------------

    new_department = Department(
        **department.model_dump()
    )

    try:
        db.add(new_department)
        db.commit()
        db.refresh(new_department)

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Department creation failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create department",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Department",
        action="Create",
        description=(
            f"Created department: "
            f"{new_department.department_name}"
        ),
    )

    return new_department


# ==========================================================
# Get All Departments
# ==========================================================

def get_all_departments(
    db: Session,
):
    """
    Return all departments.
    """

    return (
        db.query(Department)
        .order_by(Department.id.desc())
        .all()
    )


# ==========================================================
# Get Department By ID
# ==========================================================

def get_department_by_id(
    db: Session,
    department_id: int,
) -> Department:
    """
    Return a department by database ID.
    """

    department = (
        db.query(Department)
        .filter(
            Department.id == department_id
        )
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found",
        )

    return department


# ==========================================================
# Update Department
# ==========================================================

def update_department(
    db: Session,
    department_id: int,
    department_data: DepartmentUpdate,
    user_id: int,
) -> Department:
    """
    Update an existing department.

    Checks duplicate department code/name
    when either value is changed.
    """

    department = get_department_by_id(
        db,
        department_id,
    )

    # ------------------------------------------------------
    # Get Only Submitted Fields
    # ------------------------------------------------------

    update_data = department_data.model_dump(
        exclude_unset=True,
    )

    # ------------------------------------------------------
    # Check Duplicate Department Code
    # ------------------------------------------------------

    if "department_code" in update_data:

        existing_code = (
            db.query(Department)
            .filter(
                Department.department_code
                == update_data["department_code"],
                Department.id != department_id,
            )
            .first()
        )

        if existing_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department code already exists",
            )

    # ------------------------------------------------------
    # Check Duplicate Department Name
    # ------------------------------------------------------

    if "department_name" in update_data:

        existing_name = (
            db.query(Department)
            .filter(
                Department.department_name
                == update_data["department_name"],
                Department.id != department_id,
            )
            .first()
        )

        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department name already exists",
            )

    # ------------------------------------------------------
    # Update Department Fields
    # ------------------------------------------------------

    for key, value in update_data.items():
        setattr(
            department,
            key,
            value,
        )

    # ------------------------------------------------------
    # Save Changes
    # ------------------------------------------------------

    try:
        db.commit()
        db.refresh(department)

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Department update failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update department",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Department",
        action="Update",
        description=(
            f"Updated department: "
            f"{department.department_name}"
        ),
    )

    return department


# ==========================================================
# Delete Department
# ==========================================================

def delete_department(
    db: Session,
    department_id: int,
    user_id: int,
):
    """
    Delete a department.
    """

    department = get_department_by_id(
        db,
        department_id,
    )

    # ------------------------------------------------------
    # Save Name Before Delete
    # ------------------------------------------------------

    department_name = (
        department.department_name
    )

    # ------------------------------------------------------
    # Delete Department
    # ------------------------------------------------------

    try:
        db.delete(department)
        db.commit()

    except SQLAlchemyError as error:
        db.rollback()

        print(
            "Department deletion failed:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete department",
        )

    # ------------------------------------------------------
    # Audit Log
    # ------------------------------------------------------

    log_action(
        db=db,
        user_id=user_id,
        module="Department",
        action="Delete",
        description=(
            f"Deleted department: "
            f"{department_name}"
        ),
    )

    return {
        "message": "Department deleted successfully"
    }