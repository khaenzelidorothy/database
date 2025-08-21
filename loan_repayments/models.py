from django.db import models
from farmerLoan.models import Loan
from users.models import User
from django.utils import timezone

class LoanRepayment(models.Model):
    loan_repayment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loan_repayments', null=True)
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='repayments')
    due_date = models.DateTimeField()
    total_outstanding_loan = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    amount_remaining = models.DecimalField(max_digits=12, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, blank=True, null=True) 

    def __str__(self):
        return f"Repayment {self.loan_repayment_id} - Loan: {self.loan.loan_id} - Status: {self.status or 'N/A'}"

    def repayment_status(self):
     
        if self.payment_date is None and self.amount_paid == 0:
            return 'major_delay' 
        if self.payment_date is None and self.amount_remaining <= 0:
            return 'on_time'  
        if self.payment_date:
            delay_days = (self.payment_date - self.due_date).days
        else:
           
            delay_days = (timezone.now() - self.due_date).days
            if delay_days < 0:
                delay_days = 0

        if delay_days <= 0:
            return 'on_time'
        elif delay_days <= 7:
            return 'minor_delay'
        else:
            return 'major_delay'

    def process_repayment_payment(self, amount):
        if amount <= 0:
            return False, "Payment amount must be positive.", amount

        amount_to_apply = min(amount, self.amount_remaining)
        self.amount_paid += amount_to_apply
        self.amount_remaining -= amount_to_apply

        if self.amount_remaining <= 0:
            self.amount_remaining = 0
            self.status = 'inactive'  
            self.payment_date = timezone.now()

        self.save()

        self.loan.process_payment(amount_to_apply)

        excess_payment = amount - amount_to_apply
        return True, "Payment processed.", excess_payment
