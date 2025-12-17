import json
import smtplib
import os
from email.message import EmailMessage

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email(to_email, subject, body):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(SMTP_EMAIL, SMTP_PASSWORD)
        smtp.send_message(msg)

def send(event, context):
    try:
        body = json.loads(event["body"])
        action = body.get("action")
        data = body.get("data")

        if action == "BOOKING_CONFIRMATION":
            send_email(
                data["email"],
                "Appointment Confirmed",
                f"Your appointment with {data['doctor']} is confirmed."
            )

        elif action == "SIGNUP_WELCOME":
            send_email(
                data["email"],
                "Welcome to HMS",
                f"Hello {data['username']}, welcome to HMS!"
            )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Email sent"})
        }

    except Exception as e:
        print("EMAIL ERROR:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
