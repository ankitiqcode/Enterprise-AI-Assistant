"""
app/routers/prompt.py

API endpoints for AI Prompt Management.
"""

from fastapi import (
    APIRouter,
    Depends,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.prompt import (
    PromptCreate,
    PromptListResponse,
    PromptResponse,
    PromptUpdate,
)
from app.services import prompt_service

router = APIRouter(
    prefix="/prompts",
    tags=["Prompt Management"],
)

@router.post(
    "",
    response_model=PromptResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_prompt(
    request: PromptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new AI prompt.
    """

    return prompt_service.create_prompt(
        db=db,
        name=request.name,
        description=request.description,
        prompt=request.prompt,
        category=request.category,
    )

@router.get(
    "",
    response_model=PromptListResponse,
)
def get_prompts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve all prompts.
    """

    prompts = prompt_service.get_prompts(
        db=db,
    )

    return PromptListResponse(
        prompts=prompts,
    )

@router.get(
    "/{prompt_id}",
    response_model=PromptResponse,
)
def get_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve a prompt by ID.
    """

    return prompt_service.get_prompt_by_id(
        db=db,
        prompt_id=prompt_id,
    )

@router.put(
    "/{prompt_id}",
    response_model=PromptResponse,
)
def update_prompt(
    prompt_id: int,
    request: PromptUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an existing prompt.
    """

    prompt_obj = prompt_service.get_prompt_by_id(
        db=db,
        prompt_id=prompt_id,
    )

    return prompt_service.update_prompt(
        db=db,
        prompt_obj=prompt_obj,
        name=request.name,
        description=request.description,
        prompt=request.prompt,
        category=request.category,
        is_active=request.is_active,
    )
from app.schemas.prompt import (
    DeletePromptResponse,
)

@router.patch(
    "/{prompt_id}/activate",
    response_model=PromptResponse,
)
def activate_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Activate a prompt.
    """

    prompt_obj = prompt_service.get_prompt_by_id(
        db=db,
        prompt_id=prompt_id,
    )

    return prompt_service.activate_prompt(
        db=db,
        prompt_obj=prompt_obj,
    )

@router.patch(
    "/{prompt_id}/deactivate",
    response_model=PromptResponse,
)
def deactivate_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Deactivate a prompt.
    """

    prompt_obj = prompt_service.get_prompt_by_id(
        db=db,
        prompt_id=prompt_id,
    )

    return prompt_service.deactivate_prompt(
        db=db,
        prompt_obj=prompt_obj,
    )

@router.delete(
    "/{prompt_id}",
    response_model=DeletePromptResponse,
)
def delete_prompt(
    prompt_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a prompt.
    """

    prompt_obj = prompt_service.get_prompt_by_id(
        db=db,
        prompt_id=prompt_id,
    )

    prompt_service.delete_prompt(
        db=db,
        prompt_obj=prompt_obj,
    )

    return DeletePromptResponse(
        message="Prompt deleted successfully.",
    )