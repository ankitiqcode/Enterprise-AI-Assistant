"""
app/schemas/auth.py

Pydantic v2 schemas for authentication token payloads.
"""

from pydantic import BaseModel


class Token(BaseModel):
    """Response payload returned to the client after successful login."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Decoded JWT payload data used internally to identify the current user."""

    email: str | None = None