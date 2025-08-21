from django.test import TestCase

from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from loan_repayments.models import LoanRepayment
from farmerLoan.models import Loan
from django.utils import timezone
from users.models import User
from farmerLoan.models import LoanRepayment
from yourapp.utils import calculate_credit_score

class LoanRepaymentTests(APITestCase):

    def setUp(self):
        self.loan=Loan.objects.create(loan_id=1,amount_requested=500.00,amount_approved=500.00,
        purpose="Equipment loan", status= "Active", application_date="2025-03-26T05:40:50Z",approval_date="2025-03-28T05:40:50Z",
        disbursement_date="2025-03-29T05:40:50Z")

   
        self.LoanRepayment_data = {
            "loan_repayment_id": 3,
            "due_date": "2025-06-26T05:40:50Z",
            "amount_remaining": "20000.00",
            "amount_paid": "14000.00",
            "payment_date": "2025-06-26T05:41:14Z",
            "status": "Inactive",
            "loan": self.loan
        }

    def test_post_LoanRepayment(self):
        url = reverse('LoanRepayment-list')
        response = self.client.post(url, self.LoanRepayment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_LoanRepayment(self):
        LoanRepayment.objects.create(**self.LoanRepayment_data)
        url = reverse('LoanRepayment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_LoanRepayment(self):
        repayment = LoanRepayment.objects.create(**self.LoanRepayment_data)
        url = reverse('LoanRepayment-detail', args=[repayment.id])
        response = self.client.put(url, self.LoanRepayment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_LoanRepayment(self):
        repayment = LoanRepayment.objects.create(**self.LoanRepayment_data)
        url = reverse('LoanRepayment-detail', args=[repayment.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)



class LoanModelTest(TestCase):

    def setUp(self):
        """Create a Loan instance for testing."""
        self.loan = Loan.objects.create(
            amount_requested=10000.00,
            amount_approved=8000.00,
            purpose="Purchase of farming equipment",
            status="Approved",
            application_date=timezone.now(),
            approval_date=timezone.now(),
            disbursement_date=timezone.now()
        )

    def test_loan_creation(self):
        
        self.assertEqual(self.loan.amount_requested, 10000.00)
        self.assertEqual(self.loan.amount_approved, 8000.00)
        self.assertEqual(self.loan.purpose, "Purchase of farming equipment")
        self.assertEqual(self.loan.status, "Approved")

    def test_str_method(self):
        
        self.assertEqual(str(self.loan), f"Loan {self.loan.loan_id} - Status: {self.loan.status}")

    def test_dates(self):
       
        self.assertIsNotNone(self.loan.application_date)
        self.assertIsNotNone(self.loan.approval_date)
        self.assertIsNotNone(self.loan.disbursement_date)

class CooperativePartnerBankViewSetTestCase(APITestCase):
    def setUp(self):
        self.bank_data = CooperativePartnerBank.objects.create(
            bank_name = "Test Bank",
            bank_account_number ="1234567890",
            amount_owed = Decimal('1000.00'),
            amount_paid = Decimal('200.00'),
            due_date = "2025-12-31T12:00:00Z"
         
        )
        self.list_url = reverse('bankpartners-list')

    def test_create_cooperative_partner_bank(self):
        data = {
            "bank_name": "New Bank",
            "bank_account_number": "0987654321",
            "amount_owed": "1500.00",
            "amount_paid": "300.00",
            "due_date": "2025-11-30T09:00:00Z",
        }
        response = self.client.post(self.list_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['bank_name'], "New Bank")


        expected_remaining = Decimal(data['amount_owed']) - Decimal(data['amount_paid'])
        self.assertEqual(Decimal(response.data['amount_remaining']), Decimal(expected_remaining))
