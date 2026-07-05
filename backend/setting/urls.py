from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.health_check, name="health-check"),
    path("id-card/", views.id_card_image, name="id-card-image"),
]
