from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from .serializers import SignupSerializer


# -------------------------
# SIGNUP
# -------------------------
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Create token immediately
        token = Token.objects.create(user=user)

        return Response({
            "message": "Signup successful",
            "username": user.username,
            "role": user.role,
            "token": token.key,
        }, status=201)


# -------------------------
# LOGIN
# -------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "username and password required"},
                status=400
            )

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=400
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "username": user.username,
            "role": user.role,          # 👈 CLEARLY DOCTOR / PATIENT
            "token": token.key,
        })


# -------------------------
# LOGOUT
# -------------------------
class LogoutView(APIView):
    def post(self, request):
        # Delete token = full logout
        request.auth.delete()
        return Response({
            "message": "Logout successful"
        })
