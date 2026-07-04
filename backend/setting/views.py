from django.http import JsonResponse


def health_check(request):
    """Simple health-check endpoint to verify the backend is reachable."""
    return JsonResponse({
        "status": "ok",
        "message": "Django backend connected!",
    })
