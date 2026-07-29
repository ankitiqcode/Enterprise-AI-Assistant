"""
app/schemas/auth.py

Pydantic v2 schemas for authentication token payloads.
"""

from pydantic import BaseModel


class Token(BaseModel):
    """
    Response payload returned after successful authentication.
    """

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """
    Request payload for generating a new access token.
    """

    refresh_token: str


class TokenData(BaseModel):
    """
    Decoded JWT payload data used internally.
    """

    email: str | None = None