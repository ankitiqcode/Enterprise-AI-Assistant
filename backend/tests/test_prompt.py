"""
tests/test_prompt.py

Unit tests for Prompt Management APIs.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


AUTH_HEADERS = {
    "Authorization": "Bearer test_token",
}


PROMPT_DATA = {
    "name": "Resume Analyzer",
    "description": "Analyze uploaded resumes.",
    "prompt": "You are an expert HR assistant.",
    "category": "resume",
}

def test_create_prompt():
    response = client.post(
        "/prompts",
        headers=AUTH_HEADERS,
        json=PROMPT_DATA,
    )

    assert response.status_code in (
        201,
        409,
    )


def test_duplicate_prompt():
    client.post(
        "/prompts",
        headers=AUTH_HEADERS,
        json=PROMPT_DATA,
    )

    response = client.post(
        "/prompts",
        headers=AUTH_HEADERS,
        json=PROMPT_DATA,
    )

    assert response.status_code == 409

def test_get_prompts():
    response = client.get(
        "/prompts",
        headers=AUTH_HEADERS,
    )

    assert response.status_code == 200

    body = response.json()

    assert "prompts" in body

def test_get_prompt():
    response = client.get(
        "/prompts/1",
        headers=AUTH_HEADERS,
    )

    assert response.status_code in (
        200,
        404,
    )

UPDATE_DATA = {
    "description": "Updated description",
    "prompt": "Updated system prompt",
}

def test_update_prompt():
    response = client.put(
        "/prompts/1",
        headers=AUTH_HEADERS,
        json=UPDATE_DATA,
    )

    assert response.status_code in (
        200,
        404,
    )


def test_activate_prompt():
    response = client.patch(
        "/prompts/1/activate",
        headers=AUTH_HEADERS,
    )

    assert response.status_code in (
        200,
        404,
    )

def test_deactivate_prompt():
    response = client.patch(
        "/prompts/1/deactivate",
        headers=AUTH_HEADERS,
    )

    assert response.status_code in (
        200,
        404,
    )

def test_delete_prompt():
    response = client.delete(
        "/prompts/1",
        headers=AUTH_HEADERS,
    )

    assert response.status_code in (
        200,
        404,
    )

def test_prompt_without_token():
    response = client.get(
        "/prompts",
    )

    assert response.status_code == 401

def test_invalid_prompt():
    response = client.get(
        "/prompts/999999",
        headers=AUTH_HEADERS,
    )

    assert response.status_code == 404

def test_prompt_version_increment():
    response = client.put(
        "/prompts/1",
        headers=AUTH_HEADERS,
        json={
            "prompt": "New version of system prompt",
        },
    )

    assert response.status_code in (
        200,
        404,
    )

    if response.status_code == 200:
        body = response.json()

        assert body["version"] >= 2