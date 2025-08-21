from django.db import models, transaction
from django.utils import timezone
from decimal import Decimal
from django.core.exceptions import ValidationError
from api.credit import calculate_credit_score, determine_max_loan_amount
from users.models import User
from farmer_wealth.models import FarmerWealth

CHOICE_TYPE_CHOICES = [
    ('production', 'Production'),
    ('equipment', 'Equipment'),
    ('top-up', 'Top-up'),
    ('other', 'Other'),
]

STATUS_CHOICES = [
    ('pending_approval', 'Pending Approval'),
    ('approved', 'Approved'),
    ('disbursed', 'Disbursed'),
    ('repaying', 'Repaying'),
    ('fully_paid', 'Fully Paid'),
    ('rejected', 'Rejected'),
    ('cancelled', 'Cancelled'),
]


class Loan(models.Model):
    loan_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loans', null=True)
    amount_requested = models.DecimalField(max_digits=12, decimal_places=2)
    amount_approved = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    purpose = models.CharField(max_length=20, choices=CHOICE_TYPE_CHOICES, default='production')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_approval')
    application_date = models.DateTimeField(auto_now_add=True)
    approval_date = models.DateTimeField(null=True, blank=True)
    disbursement_date = models.DateTimeField(null=True, blank=True)
    current_outstanding_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit_score_at_application = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    payment_deadline = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-application_date']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'amount_requested', 'purpose', 'status'],
                condition=models.Q(status__in=['pending_approval', 'approved', 'disbursed', 'repaying']),
                name='unique_active_loan_per_user_amount_purpose'
            )
        ]

    def __str__(self):
        return f"Loan {self.loan_id} - User: {self.user.fullname if self.user else 'N/A'} - Status: {self.status}"

    def _get_latest_repayment_status(self):
        latest_repayment = self.user.loan_repayments.order_by('-due_date').first() if self.user else None
        if latest_repayment:
            return latest_repayment.repayment_status()
        return 'on_time'

    def _calculate_credit_score(self):
        if not self.user:
            raise ValidationError("Loan must be associated with a user.")

        if self.user.type != 'farmer':
            raise ValidationError("Only farmers can apply for loans.")

        farmer_wealth = FarmerWealth.objects.filter(user=self.user).first()
        if not farmer_wealth:
            raise ValidationError("No FarmerWealth data found for this farmer.")

        if farmer_wealth.livestock_number is None or farmer_wealth.income is None:
            raise ValidationError("FarmerWealth data is incomplete.")

        repayment_status = self._get_latest_repayment_status()
        max_income = 60000

        score = calculate_credit_score(
            user=self.user,
            livestock_number=farmer_wealth.livestock_number,
            monthly_income=farmer_wealth.income,
            max_income=max_income,
            repayment_status=repayment_status,
        )
        return Decimal(round(score, 2))

    def clean(self):
        super().clean()

        if not self.user:
            raise ValidationError("Loan must be associated with a user.")

        if self.user.type != 'farmer':
            raise ValidationError("Only farmers can create loan applications.")

        self.credit_score_at_application = self._calculate_credit_score()

        max_eligible_amount = determine_max_loan_amount(float(self.credit_score_at_application))

        if self.amount_requested > max_eligible_amount:
            raise ValidationError({
                'amount_requested': (
                    f"Requested amount {self.amount_requested} exceeds the maximum eligible loan amount "
                    f"{max_eligible_amount} for your credit score ({self.credit_score_at_application})."
                )
            })

        if self.amount_requested > 1000000:
            raise ValidationError({
                'amount_requested': "Maximum allowed loan amount is 1,000,000 KSH."
            })

    @transaction.atomic
    def save(self, *args, **kwargs):
        self.full_clean()

        is_new = self._state.adding
        previous_status = None

        if not is_new:
            previous = Loan.objects.filter(pk=self.pk).first()
            if previous:
                previous_status = previous.status

        super().save(*args, **kwargs)

        if self.status == 'approved' and not self.approval_date:
            self.approval_date = timezone.now()

            loan_term_days = self._calculate_loan_term_days()

            self.payment_deadline = self.approval_date + timezone.timedelta(days=loan_term_days)
            self.amount_approved = self.amount_requested
            self.current_outstanding_balance = self.amount_approved

            super().save(update_fields=['approval_date', 'payment_deadline', 'amount_approved', 'current_outstanding_balance'])

    

    def _calculate_loan_term_days(self):
        amount = float(self.amount_requested)

        low_amount_max = 300000
        low_term_min = 90
        low_term_max = 365

        high_amount_min = 300001
        high_amount_max = 1000000
        high_term_min = 365
        high_term_max = 1095

        if amount <= low_amount_max:
            proportion = amount / low_amount_max
            term_days = low_term_min + proportion * (low_term_max - low_term_min)
        elif high_amount_min <= amount <= high_amount_max:
            proportion = (amount - high_amount_min) / (high_amount_max - high_amount_min)
            term_days = high_term_min + proportion * (high_term_max - high_term_min)
        else:
            term_days = high_term_max

        return int(round(term_days))

    def mark_as_disbursed(self):
        if self.status == 'approved':
            self.status = 'disbursed'
            self.disbursement_date = timezone.now()
            self.amount_approved = self.amount_approved or self.amount_requested
            self.current_outstanding_balance = self.amount_approved
            self.save()
            return True
        return False

    def process_payment(self, amount_paid):
        if amount_paid > 0:
            self.current_outstanding_balance -= amount_paid
            if self.current_outstanding_balance <= 0:
                self.current_outstanding_balance = 0
                self.status = 'fully_paid'
            elif self.status not in ['repaying', 'disbursed']:
                self.status = 'repaying'
            self.save()
            return True
        return False
