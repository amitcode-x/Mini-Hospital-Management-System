from rest_framework import serializers
from .models import DoctorAvailability
from django.utils.timezone import now

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorAvailability
        fields = "__all__"
        read_only_fields = ("doctor", "is_booked")

    def validate(self, data):
        if data["date"] < now().date():
            raise serializers.ValidationError("Past date not allowed")

        if data["end_time"] <= data["start_time"]:
            raise serializers.ValidationError("End time must be after start time")

        return data
