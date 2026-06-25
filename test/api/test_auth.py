import requests
import os
import pytest
from config import BASE_URL
def test_login():
    response = requests.post( f"{BASE_URL}/api/auth/login", json={
        "email": "test@test.com",
        "password": "1234"
    })
    response.status_code
    assert response.status_code == 200
