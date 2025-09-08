from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from movie_booking.views import BookingViewSet, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"bookings", BookingViewSet, basename="bookings")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
