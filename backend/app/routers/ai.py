import json
import os
import shutil
import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.ai.resume_analyzer import analyze_resume
from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.ai import ResumeAnalysisResponse
from app.services.resume_service import (
    delete_resume,
    get_resume_by_id,
    get_resume_history,
    save_resume_analysis,
)
from app.utils.docx_reader import extract_docx_text
from app.utils.pdf_reader import extract_pdf_text

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)

UPLOAD_DIR = Path("app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post(
    "/analyze-resume",
    response_model=ResumeAnalysisResponse,
)
async def analyze_uploaded_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allowed_extensions = [".pdf", ".docx"]

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
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
                status_code=400,
                detail="Could not extract text from resume.",
            )

        result = analyze_resume(resume_text)

        save_resume_analysis(
            db=db,
            user_id=current_user.id,
            resume_text=resume_text,
            analysis=result,
        )

        return result

    finally:
        if file_path.exists():
            os.remove(file_path)


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    history = get_resume_history(
        db=db,
        user_id=current_user.id,
    )

    return history


@router.get("/history/{resume_id}")
def get_history_by_id(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = get_resume_by_id(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id,
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    return {
        "id": resume.id,
        "analysis": json.loads(resume.analysis),
        "created_at": resume.created_at,
    }


@router.delete("/history/{resume_id}")
def delete_history(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = get_resume_by_id(
        db=db,
        resume_id=resume_id,
        user_id=current_user.id,
    )

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found",
        )

    delete_resume(
        db=db,
        resume=resume,
    )

    return {
        "message": "Resume deleted successfully"
    }