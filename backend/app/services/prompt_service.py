"""
app/services/prompt_service.py

Business logic for AI Prompt Management.
"""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.prompt import Prompt


def create_prompt(
    db: Session,
    *,
    name: str,
    description: str | None,
    prompt: str,
    category: str,
) -> Prompt:
    """
    Create a new AI prompt.
    """

    existing = (
        db.query(Prompt)
        .filter(Prompt.name == name)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Prompt already exists.",
        )

    prompt_obj = Prompt(
        name=name,
        description=description,
        prompt=prompt,
        category=category,
        version=1,
        is_active=True,
    )

    db.add(prompt_obj)
    db.commit()
    db.refresh(prompt_obj)

    return prompt_obj

def get_prompts(
    db: Session,
) -> list[Prompt]:
    """
    Return all prompts.
    """

    return (
        db.query(Prompt)
        .order_by(
            Prompt.category.asc(),
            Prompt.name.asc(),
        )
        .all()
    )

def get_prompt_by_id(
    db: Session,
    *,
    prompt_id: int,
) -> Prompt:
    """
    Retrieve prompt by ID.
    """

    prompt = (
        db.query(Prompt)
        .filter(Prompt.id == prompt_id)
        .first()
    )

    if prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found.",
        )

    return prompt

def get_active_prompt(
    db: Session,
    *,
    category: str,
) -> Prompt:

    print("=" * 60)
    print("Requested category:", repr(category))

    prompts = db.query(Prompt).all()

    print("All prompts in DB:")
    for p in prompts:
        print(
            f"id={p.id}, category={repr(p.category)}, active={p.is_active}"
        )

    prompt = (
        db.query(Prompt)
        .filter(
            Prompt.category == category,
            Prompt.is_active.is_(True),
        )
        .first()
    )

    print("Query Result:", prompt)
    print("=" * 60)

    if prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active prompt not found.",
        )

    return prompt


def update_prompt(
    db: Session,
    *,
    prompt_obj: Prompt,
    name: str | None = None,
    description: str | None = None,
    prompt: str | None = None,
    category: str | None = None,
    is_active: bool | None = None,
) -> Prompt:
    """
    Update an existing prompt.

    Automatically increments the version when the
    prompt content changes.
    """

    content_updated = False

    if name is not None:
        prompt_obj.name = name

    if description is not None:
        prompt_obj.description = description

    if category is not None:
        prompt_obj.category = category

    if prompt is not None:
        if prompt != prompt_obj.prompt:
            prompt_obj.prompt = prompt
            content_updated = True

    if is_active is not None:
        prompt_obj.is_active = is_active

    if content_updated:
        prompt_obj.version += 1

    db.commit()
    db.refresh(prompt_obj)

    return prompt_obj


def activate_prompt(
    db: Session,
    *,
    prompt_obj: Prompt,
) -> Prompt:
    """
    Activate a prompt and deactivate all other prompts
    in the same category.
    """

    (
        db.query(Prompt)
        .filter(
            Prompt.category == prompt_obj.category,
            Prompt.id != prompt_obj.id,
        )
        .update(
            {
                Prompt.is_active: False,
            },
            synchronize_session=False,
        )
    )

    prompt_obj.is_active = True

    db.commit()
    db.refresh(prompt_obj)

    return prompt_obj

def deactivate_prompt(
    db: Session,
    *,
    prompt_obj: Prompt,
) -> Prompt:
    """
    Deactivate a prompt.
    """

    prompt_obj.is_active = False

    db.commit()
    db.refresh(prompt_obj)

    return prompt_obj

def delete_prompt(
    db: Session,
    *,
    prompt_obj: Prompt,
) -> None:
    """
    Delete a prompt.
    """

    db.delete(prompt_obj)
    db.commit()