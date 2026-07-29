from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
from app.services.audit_log_service import log_action


def create_employee(
    db: Session,
    employee: EmployeeCreate,
    user_id: int,
) -> Employee:

    existing_employee = (
        db.query(Employee)
        .filter(Employee.employee_id == employee.employee_id)
        .first()
    )

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already exists",
        )

    existing_email = (
        db.query(Employee)
        .filter(Employee.email == employee.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    new_employee = Employee(**employee.model_dump())

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    log_action(
        db=db,
        user_id=user_id,
        module="Employee",
        action="Create",
        description=f"Created employee: {new_employee.first_name} {new_employee.last_name}",
    )

    return new_employee


def get_all_employees(db: Session):
    return db.query(Employee).all()


def get_employee_by_id(db: Session, employee_id: int):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    return employee


def update_employee(
    db: Session,
    employee_id: int,
    employee_data: EmployeeUpdate,
    user_id: int,
):
    employee = get_employee_by_id(db, employee_id)

    update_data = employee_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(employee, key, value)

    db.commit()
    db.refresh(employee)

    log_action(
        db=db,
        user_id=user_id,
        module="Employee",
        action="Update",
        description=f"Updated employee: {employee.name}",
    )

    return employee


def delete_employee(
    db: Session,
    employee_id: int,
    user_id: int,
):
    employee = get_employee_by_id(db, employee_id)

    log_action(
        db=db,
        user_id=user_id,
        module="Employee",
        action="Delete",
        description=f"Deleted employee: {employee.name}",
    )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully"
    }