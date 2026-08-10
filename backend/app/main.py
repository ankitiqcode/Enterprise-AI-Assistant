"""
app/main.py

Application entrypoint for the Enterprise AI Assistant backend.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exception_handlers import register_exception_handlers
from app.core.logging import logger
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
import app.models.chat_history  # noqa: F401
import app.models.audit_log     # noqa: F401

# -----------------------------
# Routers
# -----------------------------
from app.routers import (
    ai,
    ai_workflow,
    attendance,
    audit_log,
    auth,
    chatbot,
    dashboard,
    department,
    document,
    employee,
    leave,
)

# -----------------------------
# Create Database Tables
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# Create FastAPI Application
# -----------------------------
app = FastAPI(
    title=settings.APP_NAME,
    description="Enterprise AI Assistant Backend API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -----------------------------
# Configure Logging
# -----------------------------
logger.info("=" * 60)
logger.info("Starting Enterprise AI Assistant...")
logger.info("=" * 60)

# -----------------------------
# Register Exception Handlers
# -----------------------------
register_exception_handlers(app)

# -----------------------------
# Startup & Shutdown Events
# -----------------------------
@app.on_event("startup")
async def startup_event():
    logger.info("Application Started Successfully")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Application Shutdown Successfully")


# -----------------------------
# Register Middleware
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
app.include_router(ai_workflow.router)
app.include_router(document.router)
app.include_router(audit_log.router)

# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")

    return {
        "message": "Enterprise AI Assistant API",
        "version": "1.0.0",
        "status": "Running",
    }


# -----------------------------
# Health Check
# -----------------------------
@app.get("/health")
def health_check():
    logger.info("Health check endpoint accessed")

    return {
        "status": "healthy",
        "application": settings.APP_NAME,
        "version": "1.0.0",
    }