from .conftest import client


def test_health():
    """
    Test Health Check API
    """
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy"
    }


def test_login():
    """
    Test Login API
    """
    response = client.post(
        "/auth/login",
        data={
            "username": "ankit@example.com",
            "password": "Ankit@123",
        },
    )

    assert response.status_code == 200

    data = response.json()

    # JWT Token validation
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"


def test_invalid_login():
    """
    Test Invalid Login Credentials
    """
    response = client.post(
        "/auth/login",
        data={
            "username": "wrong@example.com",
            "password": "WrongPassword123",
        },
    )

    # Invalid credentials should not return success
    assert response.status_code in [400, 401]

    data = response.json()
    assert "detail" in data