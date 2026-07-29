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


def test_dashboard_summary():
    token = get_token()

    response = client.get(
        "/dashboard/summary",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "total_employees" in data
    assert "total_departments" in data
    assert "present_today" in data
    assert "absent_today" in data
    assert "pending_leaves" in data
    assert "approved_leaves" in data
    assert "rejected_leaves" in data