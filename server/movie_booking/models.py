from django.conf import settings
from django.db import models
from django.utils import timezone
import uuid

class Booking(models.Model):
    class Status(models.TextChoices):
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")

    # Movie info (still fetched from TMDB on the frontend)
    movie_id = models.CharField(max_length=64)
    movie_title = models.CharField(max_length=255)
    poster_url = models.URLField(blank=True, null=True)

    # Minimal show information (adjust to your needs)
    show_at = models.DateTimeField(null=True, blank=True)

    # Seats & pricing
    seats = models.JSONField(default=list)
    price_per_seat = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    convenience_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Status / lifecycle
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.CONFIRMED)
    Cancelled_at = models.DateTimeField(null=True, blank=True)

    booking_code = models.CharField(max_length=12, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.booking_code:
            self.booking_code = uuid.uuid4().hex[:12].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.movie_title} - {self.user} - {self.status}"
