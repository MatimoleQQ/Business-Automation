import requests
from config import BASE_URL


def test_upload_without_token():
    files = {"file": open("test_data/sample.csv", "rb")}

    response = requests.post(f"{BASE_URL}/api/upload", files=files)

    assert response.status_code == 401