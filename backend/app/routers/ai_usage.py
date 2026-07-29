"""
app/routers/ai_usage.py

API endpoints for AI Usage Analytics.
"""

from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.ai_usage import (
    AIUsageListResponse,
    AIUsageResponse,
    AIUsageStatsResponse,
    AIUsageSummaryResponse,
)
from app.services import ai_usage_service

router = APIRouter(
    prefix="/ai-usage",
    tags=["AI Usage"],
)

@router.get(
    "",
    response_model=AIUsageListResponse,
)
#Get All AI Usage Logs
def get_ai_usage_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return all AI usage logs.
    """

    logs = ai_usage_service.get_usage_logs(
        db=db,
    )

    return AIUsageListResponse(
        logs=logs,
    )

#Get Usage By ID

@router.get(
    "/{usage_id}",
    response_model=AIUsageResponse,
)
def get_usage(
    usage_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve a usage record by ID.
    """

    return ai_usage_service.get_usage_by_id(
        db=db,
        usage_id=usage_id,
    )

#Get Current User Logs

@router.get(
    "/me",
    response_model=AIUsageListResponse,
)
def get_my_usage(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve AI usage logs for the authenticated user.
    """

    logs = ai_usage_service.get_user_usage_logs(
        db=db,
        user_id=current_user.id,
    )

    return AIUsageListResponse(
        logs=logs,
    )

#Overall AI Summary

@router.get(
    "/summary",
    response_model=AIUsageSummaryResponse,
)
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return overall AI usage summary.
    """

    return ai_usage_service.get_usage_summary(
        db=db,
    )

from app.schemas.ai_usage import (
    AIUsageSummaryResponse,
)

@router.get(
    "/features",
    response_model=AIUsageStatsResponse,
)
def get_feature_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return AI feature usage statistics.
    """

    return ai_usage_service.get_feature_statistics(
        db=db,
    )

@router.get(
    "/me/summary",
)
def get_my_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return AI usage summary for the authenticated user.
    """

    return ai_usage_service.get_user_usage_summary(
        db=db,
        user_id=current_user.id,
    )

from fastapi import status

@router.delete(
    "/{usage_id}",
    status_code=status.HTTP_200_OK,
)
def delete_usage(
    usage_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a usage log.
    """

    usage = ai_usage_service.get_usage_by_id(
        db=db,
        usage_id=usage_id,
    )

    ai_usage_service.delete_usage_log(
        db=db,
        usage=usage,
    )

    return {
        "message": "Usage log deleted successfully.",
    }

@router.delete(
    "/me",
    status_code=status.HTTP_200_OK,
)
def delete_my_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete all AI usage logs for the authenticated user.
    """

    deleted = ai_usage_service.delete_user_usage_logs(
        db=db,
        user_id=current_user.id,
    )

    return {
        "message": "Usage logs deleted successfully.",
        "deleted_records": deleted,
    }