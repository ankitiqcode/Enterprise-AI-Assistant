import uuid

from .conftest import client


# ----------------------------------------------------
# Login Helper
# ----------------------------------------------------
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


# ----------------------------------------------------
# Generate Unique Department
# ----------------------------------------------------
def unique_department():
    uid = uuid.uuid4().hex[:8]

    return {
        "department_code": f"TEST-{uid}",
        "department_name": f"Testing Department {uid}"
    }


# ----------------------------------------------------
# Test: Get Departments
# ----------------------------------------------------
def test_get_departments():
    token = get_token()

    response = client.get(
        "/departments",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ----------------------------------------------------
# Test: Create Department
# ----------------------------------------------------
def test_create_department():
    token = get_token()

    payload = unique_department()

    response = client.post(
        "/departments",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    print(response.status_code)
    print(response.json())

    assert response.status_code == 201

    data = response.json()

    assert data["department_code"] == payload["department_code"]
    assert data["department_name"] == payload["department_name"]


# ----------------------------------------------------
# Test: Get Department By ID
# ----------------------------------------------------
def test_get_department_by_id():
    token = get_token()

    payload = unique_department()

    create_response = client.post(
        "/departments",
        json=payload,
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    print(create_response.status_code)
    print(create_response.json())

    assert create_response.status_code == 201

    department = create_response.json()

    response = client.get(
        f"/departments/{department['id']}",
        headers={
            "Authorization": f"Bearer {token}"
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == department["id"]
    assert data["department_code"] == payload["department_code"]
    assert data["department_name"] == payload["department_name"]