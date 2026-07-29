"""
app/services/auth_service.py

Service layer encapsulating all authentication-related business logic:
user lookup, registration, credential verification, and login/token issuance.
"""
from app.services.audit_log_service import log_action
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserLogin


def get_user_by_email(db: Session, email: str) -> User | None:
    """
    Look up a user by email address.
    """
    return db.query(User).filter(User.email == email).first()


def register_user(db: Session, user: UserCreate) -> User:
    """
    Register a new user account.
    """

    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
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


def authenticate_user(
    db: Session,
    credentials: UserLogin,
) -> User:
    """
    Authenticate user credentials.
    """

    user = get_user_by_email(
        db,
        credentials.email,
    )

    print("\n" + "=" * 60)
    print("AUTHENTICATION DEBUG")
    print("=" * 60)

    print("User Exists :", user is not None)
    print("Email       :", credentials.email)

    if user:
        print("Stored Hash :", user.password)
        print("Input Pass  :", credentials.password)

        password_match = verify_password(
            credentials.password,
            user.password,
        )

        print("Password OK :", password_match)

    print("=" * 60 + "\n")

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        credentials.password,
        user.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return user


def login_user(
    db: Session,
    credentials: UserLogin,
) -> Token:
    """
    Authenticate a user and generate JWT token.
    """

    user = authenticate_user(
        db,
        credentials,
    )

    access_token = create_access_token(
    data={
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
    }
)

    refresh_token = create_refresh_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
        }
    )

    log_action(
        db=db,
        user_id=user.id,
        module="Authentication",
        action="Login",
        description=f"{user.email} logged in",
    )

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )