import requests
from config import BASE_URL


def test_upload_file(auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}

    files = {"file": open("test_data/sample.csv", "rb")}

    response = requests.post(
        f"{BASE_URL}/api/upload",
        headers=headers,
        files=files
    )

    assert response.status_code == 200