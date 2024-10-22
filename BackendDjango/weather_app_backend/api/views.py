from django.shortcuts import get_object_or_404
from rest_framework import status, generics, status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated


from .models import SelectedCities
from .serializers import CitiesSerializer


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username
        }, status=status.HTTP_200_OK)
    


# View to create and list user's selected cities
class SelectedCitiesListCreateView(generics.ListCreateAPIView):
    serializer_class = CitiesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only the cities associated with the authenticated user
        return SelectedCities.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Check if the user already has 5 cities
        if SelectedCities.objects.filter(user=self.request.user).count() == 5:
            raise ValidationError({"detail": "You can only select a maximum of 5 cities."})
        
        # Check if the city already exists for the user
        city_name = serializer.validated_data.get('city')
        
        if SelectedCities.objects.filter(user=self.request.user, city=city_name).exists():
            raise ValidationError({"detail": "This city is already selected."})
        
        # Save the new city for the authenticated user
        serializer.save(user=self.request.user)


# View to update or delete a specific city
class SelectedCityDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CitiesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only the cities associated with the authenticated user
        return SelectedCities.objects.filter(user=self.request.user)

    def get_object(self):
        # Retrieve the object based on city name
        city_id = self.kwargs.get("id")
        return get_object_or_404(self.get_queryset(), id=city_id)

