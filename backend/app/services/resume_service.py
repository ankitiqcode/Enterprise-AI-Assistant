import json

from sqlalchemy.orm import Session

from app.models.resume import Resume


def save_resume_analysis(
    db: Session,
    user_id: int,
    resume_text: str,
    analysis: dict,
):
    resume = Resume(
        user_id=user_id,
        resume_text=resume_text,
        analysis=json.dumps(analysis),
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return resume


def get_resume_history(
    db: Session,
    user_id: int,
):
    return (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .order_by(Resume.created_at.desc())
        .all()
    )


def get_resume_by_id(
    db: Session,
    resume_id: int,
    user_id: int,
):
    return (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == user_id,
        )
        .first()
    )


def delete_resume(
    db: Session,
    resume: Resume,
):
    db.delete(resume)
    db.commit()