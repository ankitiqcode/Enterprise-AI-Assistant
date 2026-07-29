"""
app/services/ai_service.py

Business logic for AI Resume Analysis.
"""

from __future__ import annotations

import json
import os
import shutil
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.ai.resume_analyzer import analyze_resume
from app.services.resume_service import (
    delete_resume,
    get_resume_by_id,
    get_resume_history,
    save_resume_analysis,
)
from app.utils.docx_reader import extract_docx_text
from app.utils.pdf_reader import extract_pdf_text

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
}


async def analyze_uploaded_resume(
    db: Session,
    user_id: int,
    file: UploadFile,
):
    """
    Upload, extract, analyze and save a resume.
    """

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are allowed.",
        )

    filename = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_DIR / filename

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if extension == ".pdf":
            resume_text = extract_pdf_text(str(file_path))
        else:
            resume_text = extract_docx_text(str(file_path))

        if not resume_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not extract text from resume.",
            )

        analysis = analyze_resume(resume_text)

        save_resume_analysis(
            db=db,
            user_id=user_id,
            resume_text=resume_text,
            analysis=analysis,
        )

        return analysis

    finally:
        if file_path.exists():
            os.remove(file_path)


def get_resume_history_service(
    db: Session,
    user_id: int,
):
    """
    Return resume history.
    """

    return get_resume_history(
        db=db,
        user_id=user_id,
    )


def get_resume_by_id_service(
    db: Session,
    user_id: int,
    resume_id: int,
):
    """
    Return one resume analysis.
    """

    resume = get_resume_by_id(
        db=db,
        resume_id=resume_id,
        user_id=user_id,
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    return {
        "id": resume.id,
        "analysis": json.loads(resume.analysis),
        "created_at": resume.created_at,
    }


def delete_resume_service(
    db: Session,
    user_id: int,
    resume_id: int,
):
    """
    Delete a resume analysis.
    """

    resume = get_resume_by_id(
        db=db,
        resume_id=resume_id,
        user_id=user_id,
    )

    if resume is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found.",
        )

    delete_resume(
        db=db,
        resume=resume,
    )

    return {
        "message": "Resume deleted successfully.",
    }