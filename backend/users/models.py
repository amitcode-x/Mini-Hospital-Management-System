from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("DOCTOR", "Doctor"),
        ("PATIENT", "Patient"),
    )

    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES
    )

    email = models.EmailField(unique=True)

    # Google Calendar token (optional)
    google_token = models.JSONField(null=True, blank=True)

    REQUIRED_FIELDS = ["email", "role"]

    def __str__(self):
        return f"{self.username} ({self.role})"
