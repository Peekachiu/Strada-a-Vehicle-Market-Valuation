from django.http import JsonResponse

def health_check(request):
    """
    Simple health check endpoint for AWS ALB.
    Returns 200 OK with a JSON payload.
    """
    return JsonResponse({"status": "ok"})
