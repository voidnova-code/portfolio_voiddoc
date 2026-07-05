from django.http import JsonResponse
from .models import IDCardProfile

def health_check(request):
    """Simple health-check endpoint to verify the backend is reachable."""
    return JsonResponse({
        "status": "ok",
        "message": "Django backend connected!",
    })

def id_card_image(request):
    active_profile = IDCardProfile.objects.filter(is_active=True).first()
    if active_profile and active_profile.image:
        return JsonResponse({
            "status": "ok",
            "image_url": request.build_absolute_uri(active_profile.image.url)
        })
    return JsonResponse({
        "status": "not_found",
        "message": "No active ID card image found"
    })
