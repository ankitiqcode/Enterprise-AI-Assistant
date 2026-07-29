"""
app/routers/auth.py

Authentication endpoints: user registration, login,
refresh token, and current user.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    decode_refresh_token,
)
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import (
    RefreshTokenRequest,
    Token,
)
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.auth_service import (
    get_user_by_email,
    login_user,
    register_user,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    """
    Register a new user.
    """
    return register_user(db, user)


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Authenticate user and return access and refresh tokens.
    """

    credentials = UserLogin(
        email=form_data.username,
        password=form_data.password,
    )

    return login_user(
        db,
        credentials,
    )


@router.post(
    "/refresh",
    response_model=Token,
)
def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    """
    Generate a new access token using a refresh token.
    """

    payload = decode_refresh_token(
        request.refresh_token,
    )

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user = get_user_by_email(
        db,
        payload["sub"],
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "user_id": user.id,
            "role": user.role,
        }
    )

    return Token(
        access_token=access_token,
        refresh_token=request.refresh_token,
        token_type="bearer",
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    """
    Return the currently authenticated user.
    """
    return current_user