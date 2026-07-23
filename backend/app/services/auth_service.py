"""
app/services/auth_service.py

Service layer encapsulating all authentication-related business logic:
user lookup, registration, credential verification, and login/token issuance.

Keeping this logic out of the router layer allows routers to stay thin
(HTTP concerns only) while this module owns the actual business rules.
"""

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserLogin


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Look up a user by email address.

    Args:
        db: Active SQLAlchemy session.
        email: Email address to search for.

    Returns:
        The matching User instance, or None if no user has that email.
    """
    return db.query(User).filter(User.email == email).first()


def register_user(db: Session, user: UserCreate) -> User:
    """
    Register a new user account.

    Validates that the email is not already registered, hashes the
    plaintext password, persists the new user, and returns the created
    record.

    Args:
        db: Active SQLAlchemy session.
        user: Validated registration payload.

    Returns:
        The newly created User instance.

    Raises:
        HTTPException(400): If a user with the given email already exists.
        HTTPException(500): If a database error occurs while saving.
    """
    existing_user = get_user_by_email(db, user.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error",
        )

    return new_user


def authenticate_user(db: Session, credentials: UserLogin) -> User:
    """
    Verify a user's credentials.

    Args:
        db: Active SQLAlchemy session.
        credentials: Validated login payload (email + password).

    Returns:
        The authenticated User instance.

    Raises:
        HTTPException(401): If the email does not exist or the password
            does not match.
    """
    user = get_user_by_email(db, credentials.email)
    if user is None or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return user


def login_user(db: Session, credentials: UserLogin) -> Token:
    """
    Authenticate a user and issue a JWT access token.

    Args:
        db: Active SQLAlchemy session.
        credentials: Validated login payload (email + password).

    Returns:
        A Token containing the signed JWT access token.

    Raises:
        HTTPException(401): If the email or password is invalid.
    """
    user = authenticate_user(db, credentials)

    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
        }
    )

    return Token(access_token=access_token, token_type="bearer")