import pytest
import requests
import os
from config import  BASE_URL



@pytest.fixture
def auth_token():
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "test@test.com",
        "password": "1234"
    })

    assert response.status_code == 200
    return response.json()["access_token"]