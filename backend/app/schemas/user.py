"""
app/schemas/user.py

Pydantic v2 schemas for user-related request/response payloads.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Request payload for registering a new user."""

    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    """Request payload for authenticating an existing user."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """
    Response payload representing a user.

    Excludes the password hash; only safe, public-facing fields are exposed.
    `model_config` enables construction directly from ORM model instances
    (e.g. `UserResponse.model_validate(user_orm_instance)`).
    """

    id: int
    name: str
    email: EmailStr
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)