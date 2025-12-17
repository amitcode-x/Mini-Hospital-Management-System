from google_auth_oauthlib.flow import Flow
from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse

SCOPES = ["https://www.googleapis.com/auth/calendar"]

def start_google_auth(request):
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )

    auth_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent"
    )

    request.session["google_auth_state"] = state
    return redirect(auth_url)


def google_callback(request):
    state = request.session.get("google_auth_state")

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        state=state,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )

    flow.fetch_token(authorization_response=request.build_absolute_uri())

    creds = flow.credentials

    request.user.google_token = {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": creds.scopes,
    }
    request.user.save()

    return JsonResponse({
        "message": "Google Calendar connected successfully"
    })
