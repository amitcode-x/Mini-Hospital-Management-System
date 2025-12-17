from django.urls import path
from .views import DoctorAvailabilityView, AvailableSlotsView

urlpatterns = [
    path("my-slots/", DoctorAvailabilityView.as_view()),
    path("available-slots/", AvailableSlotsView.as_view()),
]
