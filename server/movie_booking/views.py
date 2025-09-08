from datetime import datetime, date, time as dtime
from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Booking
from .serializers import BookingSerializer

# -----------------------
# Register endpoint
# -----------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "name")
        extra_kwargs = {"username": {"required": False}}

    def validate_email(self, value):
        if User.objects.filter(email_iexact=value).exists();
            raise serializers.ValidattionError("A user with that email already exists.")
        return value
    
    def create(self, validate_data):
        email = validate_data.get("email")
        password = validate_data.get("password")
        username = validated_data.get("username") or email
        name = validated_data.get("name", "")

        # ensure username is unique (append suffix if necessary)
        base_username = username
        suffix = 0
        while User.objects.filter(username=username).exists():
            suffix += 1
            username = f"{base_username}{suffix}"

        user = User.objects.create_user(username=username, email=email, password=password)
        if name:
            user.first_name = name
            user.save()
        return user


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.first_name or ""
        }, status=status.HTTP_201_CREATED)


# -----------------------
# Booking ViewSet
# -----------------------
class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by("-created_at")  # ✅ use created_at consistently
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = getattr(self.request, "user", None)
        if user and not user.is_staff:
            qs = qs.filter(user=user)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["get"], url_path="mine")
    def mine(self, request):
        include_cancelled = request.query_params.get("include_cancelled") == "true"
        qs = Booking.objects.filter(user=request.user)
        if not include_cancelled:
            qs = qs.exclude(status=Booking.Status.CANCELLED)
        qs = qs.order_by("-created_at")
        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsOwnerOrAdmin])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status == Booking.Status.CANCELLED:
            return Response({"detail": "Already cancelled"}, status=status.HTTP_400_BAD_REQUEST)

        # Simplified cutoff check (assuming show_at exists)
        show_dt = getattr(booking, "show_at", None)
        if show_dt:
            if timezone.is_naive(show_dt):
                show_dt = timezone.make_aware(show_dt, timezone.get_current_timezone())
            if show_dt <= timezone.now():
                return Response({"detail": "Showtime passed; cannot cancel"}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = Booking.Status.CANCELLED
        booking.cancelled_at = timezone.now()
        booking.save()

        serializer = BookingSerializer(booking, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

