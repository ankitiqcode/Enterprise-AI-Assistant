from .conftest import client


def get_token():
    response = client.post(
        "/auth/login",
        data={
            "username": "ankit@example.com",
            "password": "Ankit@123",
        },
    )
    assert response.status_code == 200

    return response.json()["access_token"]


def test_get_all_employees():
    token = get_token()

    response = client.get(
        "/employees/",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)