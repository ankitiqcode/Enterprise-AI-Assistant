from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.department import Department
from app.schemas.department import (
    DepartmentCreate,
    DepartmentUpdate,
)


def create_department(
    db: Session,
    department: DepartmentCreate,
) -> Department:

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

    return new_department


def get_all_departments(db: Session):
    return db.query(Department).all()


def get_department_by_id(
    db: Session,
    department_id: int,
):
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
):

    department = get_department_by_id(
        db,
        department_id,
    )

    update_data = department_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(department, key, value)

    db.commit()
    db.refresh(department)

    return department


def delete_department(
    db: Session,
    department_id: int,
):

    department = get_department_by_id(
        db,
        department_id,
    )

    db.delete(department)
    db.commit()

    return {
        "message": "Department deleted successfully"
    }