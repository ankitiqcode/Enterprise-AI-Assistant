"""
app/main.py

Application entrypoint for the Enterprise AI Assistant backend.
"""

from fastapi import FastAPI

from app.core.config import settings
from app.core.logging_middleware import LoggingMiddleware
from app.db.database import Base, engine

# -----------------------------
# Import ALL models BEFORE create_all()
# -----------------------------
import app.models.user          # noqa: F401
import app.models.employee      # noqa: F401
import app.models.department    # noqa: F401
import app.models.attendance    # noqa: F401
import app.models.leave         # noqa: F401
import app.models.resume        # noqa: F401
import app.models.document      # noqa: F401

# -----------------------------
# Routers
# -----------------------------
from app.routers import auth
from app.routers import employee
from app.routers import department
from app.routers import attendance
from app.routers import leave
from app.routers import dashboard
from app.routers import ai
from app.routers import chatbot

# -----------------------------
# Create database tables
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# FastAPI App
# -----------------------------
app = FastAPI(
    title=settings.APP_NAME,
    description="Enterprise AI Assistant Backend API",
    version="1.0.0",
)

# -----------------------------
# Middlewares
# -----------------------------
app.add_middleware(LoggingMiddleware)

# -----------------------------
# Register Routers
# -----------------------------
app.include_router(auth.router)
app.include_router(employee.router)
app.include_router(department.router)
app.include_router(attendance.router)
app.include_router(leave.router)
app.include_router(dashboard.router)
app.include_router(ai.router)
app.include_router(chatbot.router)

# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def read_root():
    return {
        "message": "Enterprise AI Assistant API",
        "version": "1.0.0",
    }


# -----------------------------
# Health Check
# -----------------------------
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }