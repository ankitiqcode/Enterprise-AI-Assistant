"""
app/services/ai_usage_service.py

Business logic for AI Usage Analytics.
"""

from __future__ import annotations

from sqlalchemy import func
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.models.ai_usage import AIUsage


def log_ai_usage(
    db: Session,
    *,
    user_id: int,
    feature: str,
    model_name: str,
    prompt: str,
    response: str,
    input_tokens: int,
    output_tokens: int,
    total_tokens: int,
    response_time: float,
    status: str = "success",
    error_message: str | None = None,
) -> AIUsage:
    """
    Store an AI request in the database.
    """

    usage = AIUsage(
        user_id=user_id,
        feature=feature,
        model_name=model_name,
        prompt=prompt,
        response=response,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        total_tokens=total_tokens,
        response_time=response_time,
        status=status,
        error_message=error_message,
    )

    db.add(usage)
    db.commit()
    db.refresh(usage)

    return usage

def get_usage_logs(
    db: Session,
) -> list[AIUsage]:
    """
    Retrieve all AI usage logs.
    """

    return (
        db.query(AIUsage)
        .order_by(
            AIUsage.created_at.desc(),
        )
        .all()
    )

def get_user_usage_logs(
    db: Session,
    *,
    user_id: int,
) -> list[AIUsage]:
    """
    Retrieve usage logs for a user.
    """

    return (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
        )
        .order_by(
            AIUsage.created_at.desc(),
        )
        .all()
    )

def get_usage_by_id(
    db: Session,
    *,
    usage_id: int,
) -> AIUsage:
    """
    Retrieve a usage record by ID.
    """

    usage = (
        db.query(AIUsage)
        .filter(
            AIUsage.id == usage_id,
        )
        .first()
    )

    if usage is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI usage record not found.",
        )

    return usage

def get_usage_summary(
    db: Session,
) -> dict:
    """
    Return overall AI usage summary.
    """

    total_requests = db.query(
        func.count(AIUsage.id),
    ).scalar() or 0

    successful_requests = (
        db.query(
            func.count(AIUsage.id),
        )
        .filter(
            AIUsage.status == "success",
        )
        .scalar()
        or 0
    )

    failed_requests = (
        db.query(
            func.count(AIUsage.id),
        )
        .filter(
            AIUsage.status == "failed",
        )
        .scalar()
        or 0
    )

    total_input_tokens = (
        db.query(
            func.sum(AIUsage.input_tokens),
        ).scalar()
        or 0
    )

    total_output_tokens = (
        db.query(
            func.sum(AIUsage.output_tokens),
        ).scalar()
        or 0
    )

    total_tokens = (
        db.query(
            func.sum(AIUsage.total_tokens),
        ).scalar()
        or 0
    )

    average_response_time = (
        db.query(
            func.avg(AIUsage.response_time),
        ).scalar()
        or 0
    )

    return {
        "total_requests": total_requests,
        "successful_requests": successful_requests,
        "failed_requests": failed_requests,
        "total_input_tokens": total_input_tokens,
        "total_output_tokens": total_output_tokens,
        "total_tokens": total_tokens,
        "average_response_time": round(
            average_response_time,
            2,
        ),
    }

def get_feature_statistics(
    db: Session,
) -> dict:
    """
    Return usage grouped by feature.
    """

    results = (
        db.query(
            AIUsage.feature,
            func.count(AIUsage.id),
        )
        .group_by(
            AIUsage.feature,
        )
        .order_by(
            func.count(AIUsage.id).desc(),
        )
        .all()
    )

    features = [
        {
            "feature": feature,
            "requests": requests,
        }
        for feature, requests in results
    ]

    most_used_feature = (
        features[0]["feature"]
        if features
        else None
    )

    return {
        "most_used_feature": most_used_feature,
        "features": features,
    }

def delete_usage_log(
    db: Session,
    *,
    usage: AIUsage,
) -> None:
    """
    Delete a usage log.
    """

    db.delete(usage)
    db.commit()

def delete_user_usage_logs(
    db: Session,
    *,
    user_id: int,
) -> int:
    """
    Delete all AI usage logs for a user.

    Returns the number of deleted records.
    """

    deleted = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
        )
        .delete(
            synchronize_session=False,
        )
    )

    db.commit()

    return deleted

def get_user_usage_summary(
    db: Session,
    *,
    user_id: int,
) -> dict:
    """
    Return AI usage summary for a specific user.
    """

    total_requests = (
        db.query(func.count(AIUsage.id))
        .filter(
            AIUsage.user_id == user_id,
        )
        .scalar()
        or 0
    )

    total_tokens = (
        db.query(
            func.sum(AIUsage.total_tokens),
        )
        .filter(
            AIUsage.user_id == user_id,
        )
        .scalar()
        or 0
    )

    average_response_time = (
        db.query(
            func.avg(AIUsage.response_time),
        )
        .filter(
            AIUsage.user_id == user_id,
        )
        .scalar()
        or 0
    )

    return {
        "total_requests": total_requests,
        "total_tokens": total_tokens,
        "average_response_time": round(
            average_response_time,
            2,
        ),
    }