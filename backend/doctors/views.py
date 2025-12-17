from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now

from .models import DoctorAvailability
from .serializers import AvailabilitySerializer
from users.permissions import IsDoctor, IsPatient


# -----------------------------
# DOCTOR: Manage own slots
# -----------------------------
class DoctorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated, IsDoctor]

    def get(self, request):
        slots = DoctorAvailability.objects.filter(doctor=request.user)
        serializer = AvailabilitySerializer(slots, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = AvailabilitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(doctor=request.user)
        return Response(serializer.data, status=201)


# -----------------------------
# PATIENT: View available slots
# -----------------------------
class AvailableSlotsView(APIView):
    permission_classes = [IsAuthenticated, IsPatient]

    def get(self, request):
        slots = DoctorAvailability.objects.filter(
            is_booked=False,
            date__gte=now().date()
        ).select_related("doctor")

        serializer = AvailabilitySerializer(slots, many=True)
        return Response(serializer.data)
