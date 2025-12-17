from django.db import models
from django.conf import settings
from doctors.models import DoctorAvailability

User = settings.AUTH_USER_MODEL

class Booking(models.Model):
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="bookings"
    )
    availability = models.OneToOneField(
        DoctorAvailability,
        on_delete=models.CASCADE,
        related_name="booking"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} -> {self.availability}"
