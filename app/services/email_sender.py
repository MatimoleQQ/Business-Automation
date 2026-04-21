import os
import base64

from email.message import EmailMessage

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

CREDENTIALS_PATH = "secrets/credentials.json"
TOKEN_PATH = "secrets/token.json"


def send_gmail(receiver, subject, body, attachment_path):
    creds = None

    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(
            TOKEN_PATH, SCOPES
        )

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_PATH,
                SCOPES
            )
            creds = flow.run_local_server(port=0)

        with open(TOKEN_PATH, "w") as token:
            token.write(creds.to_json())

    service = build("gmail", "v1", credentials=creds)

    message = EmailMessage()
    message["To"] = receiver
    message["Subject"] = subject
    message.set_content(body)

    with open(attachment_path, "rb") as f:
        file_data = f.read()

    message.add_attachment(
        file_data,
        maintype="application",
        subtype="pdf",
        filename=os.path.basename(attachment_path)
    )

    raw_message = base64.urlsafe_b64encode(
        message.as_bytes()
    ).decode()

    service.users().messages().send(
        userId="me",
        body={"raw": raw_message}
    ).execute()