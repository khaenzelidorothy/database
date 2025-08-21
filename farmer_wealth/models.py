from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from users.models import User


class FarmerWealth(models.Model):
    farmer_wealth_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wealth_record', null=True)
    milk_quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    income = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Monthly income
    livestock_number = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(30)]
    )

    def __str__(self):
        return f"Wealth Record {self.farmer_wealth_id} - Farmer: {self.user.fullname if self.user else 'N/A'}"
