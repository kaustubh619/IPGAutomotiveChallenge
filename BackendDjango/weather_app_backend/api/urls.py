from django.urls import path
from .views import CustomAuthToken, SelectedCitiesListCreateView, SelectedCityDetailView

urlpatterns = [
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('cities/', SelectedCitiesListCreateView.as_view(), name='list-create-cities'),
    path('city/<int:id>/', SelectedCityDetailView.as_view(), name='update-delete-city'),
]