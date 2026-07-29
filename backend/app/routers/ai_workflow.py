"""
app/routers/ai_workflow.py

Router for Enterprise AI Workflow Engine.
"""

from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.db.database import get_db
from app.models.user import User
from app.schemas.ai_workflow import (
    AIWorkflowRequest,
    AIWorkflowResponse,
)
from app.services.ai_workflow_service import (
    get_workflow_service,
)

router = APIRouter(
    prefix="/ai-workflow",
    tags=["AI Workflow"],
)


@router.post(
    "/execute",
    response_model=AIWorkflowResponse,
)
def execute_ai_workflow(
    request: AIWorkflowRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            "admin",
            "hr",
            "manager",
            "employee",
        )
    ),
):
    """
    Execute Enterprise AI Workflow.

    Workflow:
    1. Load Prompt
    2. Retrieve RAG Context
    3. Call Gemini
    4. Save Chat History
    5. Log AI Usage
    """

    workflow = get_workflow_service(db)

    return workflow.execute(
        user_id=current_user.id,
        feature=request.feature,
        user_prompt=request.prompt,
        conversation_id=request.conversation_id,
    )