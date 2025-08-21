from django.db import models
from decimal import Decimal

class CooperativePartnerBank(models.Model):

    bank_partner_id = models.AutoField(primary_key=True)
    bank_name = models.CharField(max_length=40)
    bank_account_number = models.CharField(max_length=20)
    amount_owed = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    amount_disbursed = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    due_date = models.DateTimeField()
    amount_remaining = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.amount_remaining = self.amount_owed - self.amount_paid
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"Bank {self.bank_name} - Partner ID: {self.bank_partner_id}"
    