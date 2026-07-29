from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.department import Department
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)
from app.services.audit_log_service import log_action


def create_department(
    db: Session,
    department: DepartmentCreate,
    user_id: int,
) -> Department:
    """
    Create a new department.
    """

    # Check duplicate department code
    existing_code = (
        db.query(Department)
        .filter(
            Department.department_code == department.department_code
        )
        .first()
    )

    if existing_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department code already exists",
        )

    # Check duplicate department name
    existing_name = (
        db.query(Department)
        .filter(
            Department.department_name == department.department_name
        )
        .first()
    )

    if existing_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department name already exists",
        )

    new_department = Department(**department.model_dump())

    db.add(new_department)
    db.commit()
    db.refresh(new_department)

    log_action(
        db=db,
        user_id=user_id,
        module="Department",
        action="Create",
        description=f"Created department: {new_department.department_name}",
    )

    return new_department


def get_all_departments(db: Session):
    """
    Return all departments.
    """
    return db.query(Department).all()


def get_department_by_id(
    db: Session,
    department_id: int,
) -> Department:
    """
    Return department by ID.
    """

    department = (
        db.query(Department)
        .filter(Department.id == department_id)
        .first()
    )

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found",
        )

    return department


def update_department(
    db: Session,
    department_id: int,
    department_data: DepartmentUpdate,
    user_id: int,
) -> Department:
    """
    Update department.
    """

    department = get_department_by_id(
        db,
        department_id,
    )

    update_data = department_data.model_dump(
        exclude_unset=True,
    )

    # Check duplicate department code
    if "department_code" in update_data:
        existing_code = (
            db.query(Department)
            .filter(
                Department.department_code == update_data["department_code"],
                Department.id != department_id,
            )
            .first()
        )

        if existing_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department code already exists",
            )

    # Check duplicate department name
    if "department_name" in update_data:
        existing_name = (
            db.query(Department)
            .filter(
                Department.department_name == update_data["department_name"],
                Department.id != department_id,
            )
            .first()
        )

        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Department name already exists",
            )

    for key, value in update_data.items():
        setattr(
            department,
            key,
            value,
        )

    db.commit()
    db.refresh(department)

    log_action(
        db=db,
        user_id=user_id,
        module="Department",
        action="Update",
        description=f"Updated department: {department.department_name}",
    )

    return department


def delete_department(
    db: Session,
    department_id: int,
    user_id: int,
):
    """
    Delete department.
    """

    department = get_department_by_id(
        db,
        department_id,
    )

    log_action(
        db=db,
        user_id=user_id,
        module="Department",
        action="Delete",
        description=f"Deleted department: {department.department_name}",
    )

    db.delete(department)
    db.commit()

    return {
        "message": "Department deleted successfully"
    }