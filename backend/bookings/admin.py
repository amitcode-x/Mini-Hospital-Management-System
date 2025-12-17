from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "patient",
        "get_doctor",
        "get_date",
        "get_time",
        "created_at",
    )

    def get_doctor(self, obj):
        return obj.availability.doctor.username

    def get_date(self, obj):
        return obj.availability.date

    def get_time(self, obj):
        return f"{obj.availability.start_time} - {obj.availability.end_time}"
