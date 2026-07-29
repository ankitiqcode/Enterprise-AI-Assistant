"""
app/services/leave_service.py

Business logic for Leave Management.
"""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.employee import Employee
from app.models.leave import Leave, LeaveStatus
from app.schemas.leave import LeaveCreate, LeaveUpdate
from app.services.audit_log_service import log_action


def apply_leave(
    db: Session,
    leave: LeaveCreate,
    user_id: int,
) -> Leave:
    """
    Apply for leave.
    """

    employee = (
        db.query(Employee)
        .filter(Employee.id == leave.employee_id)
        .first()
    )

    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    if leave.end_date < leave.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be earlier than start date.",
        )

    leave_obj = Leave(**leave.model_dump())

    try:
        db.add(leave_obj)
        db.commit()
        db.refresh(leave_obj)

        log_action(
            db=db,
            user_id=user_id,
            module="Leave",
            action="Apply",
            description=(
                f"Applied leave for Employee ID "
                f"{leave_obj.employee_id}"
            ),
        )

        return leave_obj

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to apply leave.",
        )


def get_all_leaves(
    db: Session,
) -> list[Leave]:
    """
    Return all leave requests.
    """

    return (
        db.query(Leave)
        .order_by(
            Leave.applied_at.desc(),
        )
        .all()
    )


def get_leave_by_id(
    db: Session,
    leave_id: int,
) -> Leave:
    """
    Return leave request by ID.
    """

    leave = (
        db.query(Leave)
        .filter(
            Leave.id == leave_id,
        )
        .first()
    )

    if leave is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found.",
        )

    return leave


def get_leaves_by_employee(
    db: Session,
    employee_id: int,
) -> list[Leave]:
    """
    Return all leave requests of an employee.
    """

    return (
        db.query(Leave)
        .filter(
            Leave.employee_id == employee_id,
        )
        .order_by(
            Leave.start_date.desc(),
        )
        .all()
    )


def update_leave(
    db: Session,
    leave_id: int,
    leave_data: LeaveUpdate,
    user_id: int,
) -> Leave:
    """
    Update leave request.
    """

    leave = get_leave_by_id(
        db,
        leave_id,
    )

    update_data = leave_data.model_dump(
        exclude_unset=True,
    )

    start_date = update_data.get(
        "start_date",
        leave.start_date,
    )

    end_date = update_data.get(
        "end_date",
        leave.end_date,
    )

    if end_date < start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be earlier than start date.",
        )

    for key, value in update_data.items():
        setattr(
            leave,
            key,
            value,
        )

    try:
        db.commit()
        db.refresh(leave)

        log_action(
            db=db,
            user_id=user_id,
            module="Leave",
            action="Update",
            description=(
                f"Updated leave request ID {leave.id}"
            ),
        )

        return leave

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update leave request.",
        )


def approve_leave(
    db: Session,
    leave_id: int,
    user_id: int,
) -> Leave:
    """
    Approve leave request.
    """

    leave = get_leave_by_id(
        db,
        leave_id,
    )

    leave.status = LeaveStatus.APPROVED

    try:
        db.commit()
        db.refresh(leave)

        log_action(
            db=db,
            user_id=user_id,
            module="Leave",
            action="Approve",
            description=(
                f"Approved leave request ID {leave.id}"
            ),
        )

        return leave

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to approve leave.",
        )


def reject_leave(
    db: Session,
    leave_id: int,
    user_id: int,
) -> Leave:
    """
    Reject leave request.
    """

    leave = get_leave_by_id(
        db,
        leave_id,
    )

    leave.status = LeaveStatus.REJECTED

    try:
        db.commit()
        db.refresh(leave)

        log_action(
            db=db,
            user_id=user_id,
            module="Leave",
            action="Reject",
            description=(
                f"Rejected leave request ID {leave.id}"
            ),
        )

        return leave

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reject leave.",
        )


def delete_leave(
    db: Session,
    leave_id: int,
    user_id: int,
) -> dict[str, str]:
    """
    Delete leave request.
    """

    leave = get_leave_by_id(
        db,
        leave_id,
    )

    try:
        log_action(
            db=db,
            user_id=user_id,
            module="Leave",
            action="Delete",
            description=(
                f"Deleted leave request ID {leave.id}"
            ),
        )

        db.delete(leave)
        db.commit()

        return {
            "message": "Leave request deleted successfully."
        }

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete leave request.",
        )