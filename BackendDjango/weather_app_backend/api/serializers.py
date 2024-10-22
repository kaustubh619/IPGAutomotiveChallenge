from .models import SelectedCities
from rest_framework import serializers


class CitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectedCities
        fields = '__all__'
        read_only_fields = ['user']