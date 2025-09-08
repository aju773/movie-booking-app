from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            "id", "user", "movie_id", "movie_title", "poster_url",
            "show_at", "seats", "price_per_seat", "convenience_fee", "total_amount",
            "status", "cancelled_at", "booking_code", "created_at"
        ]
        read_only_fields = ["id", "user", "status", "cancelled_at", "booking_code", "created_at"]

    def create(self, validate_data):
        validate_data["user"] = self.context["request"].user
        return super().create(validate_data)
