from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from datetime import datetime

from .models import Booking
from doctors.models import DoctorAvailability
from .serializers import BookingSerializer
from users.permissions import IsPatient

from integrations.google_calendar import create_calendar_event
from utils.email_client import send_booking_email


class BookSlotView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    @transaction.atomic
    def post(self, request):
        slot_id = request.data.get("slot_id")

        if not slot_id:
            return Response({"error": "slot_id required"}, status=400)

        # 🔒 DB LOCK (race-condition safe)
        try:
            slot = DoctorAvailability.objects.select_for_update().get(
                id=slot_id,
                is_booked=False
            )
        except DoctorAvailability.DoesNotExist:
            return Response(
                {"error": "Slot already booked or not found"},
                status=400
            )

        # Create booking
        booking = Booking.objects.create(
            patient=request.user,
            availability=slot
        )

        # Mark slot as booked
        slot.is_booked = True
        slot.save()

        # Datetime for calendar
        start_dt = datetime.combine(slot.date, slot.start_time)
        end_dt = datetime.combine(slot.date, slot.end_time)

        # 🔔 External services (fail-safe)
        try:
            # Doctor calendar
            create_calendar_event(
                slot.doctor,
                f"Appointment with {request.user.username}",
                start_dt,
                end_dt
            )

            # Patient calendar
            create_calendar_event(
                request.user,
                f"Appointment with Dr. {slot.doctor.username}",
                start_dt,
                end_dt
            )

            # Email
            send_booking_email(
                request.user.email,
                slot.doctor.username
            )

        except Exception as e:
            # Booking should NEVER fail because of email/calendar
            print("Calendar / Email error:", e)

        return Response(
            BookingSerializer(booking).data,
            status=201
        )
