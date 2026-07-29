"""
app/core/exceptions.py

Custom application exceptions.
"""


class AppException(Exception):
    """
    Base application exception.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class NotFoundException(AppException):
    """
    Raised when a requested resource is not found.
    """

    pass


class BadRequestException(AppException):
    """
    Raised when request data is invalid.
    """

    pass


class UnauthorizedException(AppException):
    """
    Raised when authentication fails.
    """

    pass


class ForbiddenException(AppException):
    """
    Raised when the user does not have permission.
    """

    pass


class ConflictException(AppException):
    """
    Raised when a duplicate resource already exists.
    """

    pass