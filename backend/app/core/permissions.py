"""
app/core/permissions.py

Role-based access control for the application.
"""

from typing import Callable

from fastapi import Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.models.user import User


def require_roles(*allowed_roles: str) -> Callable:
    """
    Restrict endpoint access based on user role.

    Role comparison is case-insensitive.

    Example:
        require_roles("admin", "hr", "manager")
    """

    # Normalize allowed roles once
    normalized_roles = {
        role.strip().lower()
        for role in allowed_roles
    }

    def role_checker(
        current_user: User = Depends(get_current_user),
    ) -> User:

        # Normalize user's role from database
        user_role = (
            str(current_user.role)
            .strip()
            .lower()
        )

        print(
            "DEBUG ROLE:",
            current_user.email,
            "RAW ROLE:",
            current_user.role,
            "NORMALIZED ROLE:",
            user_role,
            "ALLOWED:",
            normalized_roles,
        )

        # --------------------------------------------------
        # Check permission
        # --------------------------------------------------

        if user_role not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"You don't have permission to "
                    f"perform this action. Required roles: "
                    f"{', '.join(normalized_roles)}"
                ),
            )

        return current_user

    return role_checker