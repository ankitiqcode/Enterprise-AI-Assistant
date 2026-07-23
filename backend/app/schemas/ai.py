from datetime import datetime

from pydantic import BaseModel


# ==========================================
# Resume Analysis
# ==========================================

class ResumeAnalysisResponse(BaseModel):
    resume_score: int
    ats_score: int
    skills_detected: list[str]
    missing_skills: list[str]
    experience_summary: str
    education_summary: str
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[str]


# ==========================================
# Resume History
# ==========================================

class ResumeHistoryItem(BaseModel):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# Chatbot
# ==========================================

class ChatRequest(BaseModel):
    question: str


class SourceResponse(BaseModel):
    document_id: int
    filename: str


class ChatResponse(BaseModel):
    answer: str
    context_chunks: int
    sources: list[SourceResponse]


# ==========================================
# Document Management
# ==========================================

class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    uploaded_by: int
    created_at: datetime

    class Config:
        from_attributes = True


class DeleteResponse(BaseModel):
    message: str