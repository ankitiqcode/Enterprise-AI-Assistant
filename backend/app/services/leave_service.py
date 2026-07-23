from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.leave import Leave
from app.schemas.leave import LeaveCreate, LeaveUpdate


def apply_leave(
    db: Session,
    leave: LeaveCreate,
):
    # Check employee exists
    employee = (
        db.query(Employee)
        .filter(Employee.id == leave.employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found",
        )

    # Validate dates
    if leave.end_date < leave.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be before start date.",
        )

    new_leave = Leave(**leave.model_dump())

    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)

    return new_leave


def get_all_leaves(db: Session):
    return db.query(Leave).all()


def get_leave_by_id(
    db: Session,
    leave_id: int,
):
    leave = (
        db.query(Leave)
        .filter(Leave.id == leave_id)
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found",
        )

    return leave


def get_leaves_by_employee(
    db: Session,
    employee_id: int,
):
    return (
        db.query(Leave)
        .filter(Leave.employee_id == employee_id)
        .all()
    )


def update_leave(
    db: Session,
    leave_id: int,
    leave_data: LeaveUpdate,
):
    leave = get_leave_by_id(db, leave_id)

    update_data = leave_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(leave, key, value)

    db.commit()
    db.refresh(leave)

    return leave


def delete_leave(
    db: Session,
    leave_id: int,
):
    leave = get_leave_by_id(db, leave_id)

    db.delete(leave)
    db.commit()

    return {
        "message": "Leave request deleted successfully"
    }