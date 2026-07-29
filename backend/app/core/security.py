"""
app/core/security.py

Centralized security utilities for the Enterprise AI Assistant backend.

Responsibilities:
    - Password hashing & verification (bcrypt via passlib)
    - JWT access token creation & decoding (python-jose)

All configuration (secret key, algorithm, token expiry) is pulled from
app.core.config.settings, which in turn reads from the .env file.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# --------------------------------------------------------------------------
# Password hashing context
# --------------------------------------------------------------------------
# We use bcrypt as the hashing scheme. `deprecated="auto"` allows passlib
# to automatically flag/rehash passwords hashed with older schemes if the
# scheme list is ever extended in the future.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.

    Args:
        password: The plaintext password to hash.

    Returns:
        The bcrypt-hashed password as a string, safe to store in the DB.
    """
    if not password:
        raise ValueError("Password must not be empty.")
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a stored bcrypt hash.

    Args:
        plain_password: The plaintext password provided by the user (e.g. at login).
        hashed_password: The bcrypt hash stored in the database.

    Returns:
        True if the password matches the hash, False otherwise.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except (ValueError, TypeError):
        # Raised by passlib if the hash is malformed/unrecognized.
        return False


# --------------------------------------------------------------------------
# JWT access token utilities
# --------------------------------------------------------------------------

def create_access_token(
    data: dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload to embed in the token (e.g. {"sub": user_email, "id": user_id}).
              This dict is copied, never mutated in place.
        expires_delta: Optional custom expiry duration. If not provided,
                       falls back to settings.ACCESS_TOKEN_EXPIRE_MINUTES.

    Returns:
        The encoded JWT as a string.
    """
    to_encode = data.copy()

    if expires_delta is not None:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    # Standard JWT claims: exp (expiry) and iat (issued at)
    to_encode.update(
        {
            "exp": expire,
            "iat": datetime.now(timezone.utc),
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decode and validate a JWT access token.

    Args:
        token: The encoded JWT string.

    Returns:
        The decoded payload dict if the token is valid and not expired,
        otherwise None.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return payload
    except JWTError:
        # Covers signature errors, expired tokens, malformed tokens, etc.
        return None

# --------------------------------------------------------------------------
# JWT Refresh Token utilities
# --------------------------------------------------------------------------

def create_refresh_token(
    data: dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a signed JWT refresh token.
    """

    to_encode = data.copy()

    if expires_delta is not None:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Default: 7 days
        expire = datetime.now(timezone.utc) + timedelta(days=7)

    to_encode.update(
        {
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "refresh",
        }
    )

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_refresh_token(
    token: str,
) -> Optional[dict[str, Any]]:
    """
    Decode and validate a refresh token.
    """

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )

        if payload.get("type") != "refresh":
            return None

        return payload

    except JWTError:
        return None