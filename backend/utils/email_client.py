from django.core.mail import send_mail
from django.conf import settings

def send_booking_email(email, doctor_name):
    print("📧 Sending booking email to:", email)

    send_mail(
        subject="Appointment Confirmed",
        message=f"Your appointment with Dr. {doctor_name} is confirmed.",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[email],
        fail_silently=False,
    )

    print("✅ Email sent successfully")
