"""
tests/test_document.py

Unit tests for Document Management APIs.
"""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


PDF_FILE = Path("tests/files/sample.pdf")
TXT_FILE = Path("tests/files/sample.txt")
DOCX_FILE = Path("tests/files/sample.docx")
INVALID_FILE = Path("tests/files/sample.exe")


@pytest.fixture
def auth_headers():
    """
    Replace this token with your login fixture
    if your project already has one.
    """
    return {
        "Authorization": "Bearer test_token"
    }

def test_upload_pdf(auth_headers):
    with open(PDF_FILE, "rb") as file:

        response = client.post(
            "/documents/upload",
            headers=auth_headers,
            files={
                "file": (
                    "sample.pdf",
                    file,
                    "application/pdf",
                )
            },
        )

    assert response.status_code == 201

    data = response.json()

    assert data["message"] == "Document uploaded successfully."

def test_upload_docx(auth_headers):
    with open(DOCX_FILE, "rb") as file:

        response = client.post(
            "/documents/upload",
            headers=auth_headers,
            files={
                "file": (
                    "sample.docx",
                    file,
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                )
            },
        )

    assert response.status_code == 201

def test_upload_txt(auth_headers):
    with open(TXT_FILE, "rb") as file:

        response = client.post(
            "/documents/upload",
            headers=auth_headers,
            files={
                "file": (
                    "sample.txt",
                    file,
                    "text/plain",
                )
            },
        )

    assert response.status_code == 201

def test_invalid_extension(auth_headers):
    with open(INVALID_FILE, "rb") as file:

        response = client.post(
            "/documents/upload",
            headers=auth_headers,
            files={
                "file": (
                    "sample.exe",
                    file,
                    "application/octet-stream",
                )
            },
        )

    assert response.status_code == 400

def test_duplicate_upload(auth_headers):
    """
    Uploading the same file twice should fail.
    """

    with open(PDF_FILE, "rb") as file:
        client.post(
            "/documents/upload",
            headers=auth_headers,
            files={
                "file": (
                    "sample.pdf",
                    file,
                    "application/pdf",
                )
            },
        )

    with open(PDF_FILE, "rb") as file:
        response = client.post(
            "/documents/upload",
            headers=auth_headers,
            files={
                "file": (
                    "sample.pdf",
                    file,
                    "application/pdf",
                )
            },
        )

    assert response.status_code == 409

def test_get_documents(auth_headers):
    response = client.get(
        "/documents",
        headers=auth_headers,
    )

    assert response.status_code == 200

    body = response.json()

    assert "documents" in body

def test_get_document(auth_headers):
    response = client.get(
        "/documents/1",
        headers=auth_headers,
    )

    assert response.status_code in (
        200,
        404,
    )

def test_reindex_document(auth_headers):
    response = client.put(
        "/documents/1/reindex",
        headers=auth_headers,
    )

    assert response.status_code in (
        200,
        404,
    )

def test_delete_document(auth_headers):
    response = client.delete(
        "/documents/1",
        headers=auth_headers,
    )

    assert response.status_code in (
        200,
        404,
    )

def test_upload_without_token():
    with open(PDF_FILE, "rb") as file:
        response = client.post(
            "/documents/upload",
            files={
                "file": (
                    "sample.pdf",
                    file,
                    "application/pdf",
                )
            },
        )

    assert response.status_code == 401

def test_invalid_document_id(auth_headers):
    response = client.get(
        "/documents/999999",
        headers=auth_headers,
    )

    assert response.status_code == 404