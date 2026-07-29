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


@lru_cache(maxsize=1)
def get_gemini_client() -> genai.Client:
    """
    Create and cache the Gemini client.
    """

    if not settings.GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is missing in .env"
        )

    print(f"Gemini Key: {settings.GEMINI_API_KEY[:10]}********")

    return genai.Client(
        api_key=settings.GEMINI_API_KEY,
    )


def generate_rag_response(
    *,
    question: str,
    context: str,
) -> str:
    """
    Generate an answer grounded in retrieved context.
    """

    client = get_gemini_client()

    prompt = f"""
You are an Enterprise HR AI Assistant.

Answer ONLY using the provided context.

If the answer is not present in the context,
respond exactly with:

"I couldn't find that information in the uploaded documents."

--------------------
Context:
{context}
--------------------

Question:
{question}
"""

    try:

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

    except ClientError as e:
        print("Gemini Client Error:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Gemini API Error: {e}",
        )

    except Exception as e:
        print("Unexpected Gemini Error:", e)

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )