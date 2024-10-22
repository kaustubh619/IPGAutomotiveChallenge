from django.db import models
from django.contrib.auth.models import User


class SelectedCities(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.CharField(max_length=100)

    def __str__(self):
        return '{} selected {}'.format(self.user.username, self.city)
