from django.contrib import admin
from .models import DoctorAvailability

@admin.register(DoctorAvailability)
class DoctorAvailabilityAdmin(admin.ModelAdmin):
    list_display = ("doctor", "date", "start_time", "end_time", "is_booked")
    list_filter = ("doctor", "date", "is_booked")
