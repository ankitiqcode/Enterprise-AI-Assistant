"""
app/routers/ai.py

AI and RAG API routes.
"""

from __future__ import annotations

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User

from app.schemas.ai import (
    ResumeAnalysisResponse,
)

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from app.services.ai_service import (
    analyze_uploaded_resume,
    delete_resume_service,
    get_resume_by_id_service,
    get_resume_history_service,
)

from app.services.rag_service import (
    ask_question,
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


# ==========================================================
# Resume Analysis
# ==========================================================

@router.post(
    "/analyze-resume",
    response_model=ResumeAnalysisResponse,
    summary="Analyze Resume",
)
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Upload and analyze a resume.
    """

    return await analyze_uploaded_resume(
        db=db,
        user_id=current_user.id,
        file=file,
    )


# ==========================================================
# Resume History
# ==========================================================

@router.get(
    "/history",
    summary="Resume History",
)
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Get resume analysis history
    for the current user.
    """

    return get_resume_history_service(
        db=db,
        user_id=current_user.id,
    )


# ==========================================================
# Resume By ID
# ==========================================================

@router.get(
    "/history/{resume_id}",
    summary="Resume By ID",
)
def get_history_by_id(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Get a specific resume analysis.
    """

    return get_resume_by_id_service(
        db=db,
        user_id=current_user.id,
        resume_id=resume_id,
    )


# ==========================================================
# Delete Resume
# ==========================================================

@router.delete(
    "/history/{resume_id}",
    summary="Delete Resume",
)
def delete_history(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Delete a resume analysis.
    """

    return delete_resume_service(
        db=db,
        user_id=current_user.id,
        resume_id=resume_id,
    )


# ==========================================================
# RAG Chat
# ==========================================================

@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="Chat with uploaded documents",
)
def chat(
    request: ChatRequest,
    current_user: User = Depends(
        get_current_user
    ),
):
    """
    Ask questions about uploaded documents.
    """

    answer = ask_question(
        request.question
    )

    return ChatResponse(
        answer=answer,
    )