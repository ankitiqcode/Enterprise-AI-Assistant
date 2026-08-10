"""
app/services/gemini_service.py

Google Gemini AI Service.
"""

from __future__ import annotations

from functools import lru_cache

from fastapi import HTTPException
from google import genai
from google.genai import types
from google.genai.errors import ClientError

from app.core.config import settings


# ==========================================================
# Gemini Client
# ==========================================================

@lru_cache(maxsize=1)
def get_gemini_client() -> genai.Client:
    """
    Create and cache the Gemini client.
    """

    if not settings.GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is missing in .env"
        )

    return genai.Client(
        api_key=settings.GEMINI_API_KEY,
    )


# ==========================================================
# Generate RAG Response
# ==========================================================

def generate_rag_response(
    *,
    question: str,
    context: list[str] | str,
) -> str:
    """
    Generate an answer grounded in retrieved context.
    """

    if not question or not question.strip():
        return "Please provide a question."

    # ------------------------------------------------------
    # Normalize context
    # ------------------------------------------------------

    if isinstance(context, list):
        context_text = "\n\n---\n\n".join(
            str(item)
            for item in context
            if item
        )
    else:
        context_text = str(context).strip()

    if not context_text:
        return (
            "I couldn't find that information "
            "in the uploaded documents."
        )

    # ------------------------------------------------------
    # Prompt
    # ------------------------------------------------------

    prompt = f"""
You are an Enterprise HR AI Assistant.

Answer ONLY using the provided context.

Do not use outside knowledge.

If the answer is not present in the context,
respond exactly with:

"I couldn't find that information in the uploaded documents."

---

CONTEXT:
{context_text}

---

QUESTION:
{question}

---

ANSWER:
"""

    # ------------------------------------------------------
    # Gemini Request
    # ------------------------------------------------------

    try:
        client = get_gemini_client()

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                max_output_tokens=1024,
            ),
        )

        if response.text:
            return response.text.strip()

        return "No response generated."

    # ------------------------------------------------------
    # Gemini API Error
    # ------------------------------------------------------

    except ClientError as exc:
        print(
            "Gemini Client Error:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail="Gemini API request failed.",
        ) from exc

    # ------------------------------------------------------
    # Unexpected Error
    # ------------------------------------------------------

    except Exception as exc:
        print(
            "Unexpected Gemini Error:",
            exc,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI response.",
        ) from exc