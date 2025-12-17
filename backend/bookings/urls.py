from django.urls import path
from .views import BookSlotView

urlpatterns = [
    path("book/", BookSlotView.as_view()),
]
