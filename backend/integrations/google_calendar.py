from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

def create_calendar_event(user, title, start_dt, end_dt):
    if not user.google_token:
        return

    creds = Credentials(**user.google_token)
    service = build("calendar", "v3", credentials=creds)

    event = {
        "summary": title,
        "description": "Hospital Appointment",
        "start": {
            "dateTime": start_dt.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": end_dt.isoformat(),
            "timeZone": "Asia/Kolkata",
        },
    }

    service.events().insert(
        calendarId="primary",
        body=event
    ).execute()
