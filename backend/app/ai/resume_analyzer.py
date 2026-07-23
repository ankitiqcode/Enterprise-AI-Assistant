import json

from app.ai.gemini import client
from app.ai.prompts import RESUME_ANALYZER_PROMPT


def analyze_resume(resume_text: str):
    prompt = RESUME_ANALYZER_PROMPT + resume_text

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)