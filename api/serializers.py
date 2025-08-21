from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from decimal import Decimal

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q
from rest_framework.authtoken.models import Token
from farmer_wealth.models import FarmerWealth
from loan_repayments.models import LoanRepayment
from bankpartners.models import CooperativePartnerBank
from document.models import Document
from users.models import User
from farmerLoan.models import Loan
from api.credit import calculate_credit_score, determine_max_loan_amount


class FarmerWealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerWealth
        fields = '__all__'

    def validate_user(self, value):
        if FarmerWealth.objects.filter(user=value).exists():
            raise serializers.ValidationError("FarmerWealth record for this user already exists.")
        return value


class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = '__all__'


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


class CooperativePartnerBankSerializer(serializers.ModelSerializer):
    amount_remaining = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = CooperativePartnerBank
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
        error_messages={'min_length': 'Password must be at least 8 characters long.'}
    )
    phone_number = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="Phone number already registered.")]
    )

    class Meta:
        model = User
        fields = '__all__'

    def validate(self, attrs):
        user_type = attrs.get('type')
        national_id = attrs.get('national_id')
        cooperative_id = attrs.get('cooperative_id')

        if user_type == 'farmer' and national_id:
            if User.objects.filter(Q(national_id=national_id)).exists():
                raise serializers.ValidationError({"national_id": "National ID already registered."})

        if user_type == 'cooperative' and cooperative_id:
            if User.objects.filter(Q(cooperative_id=cooperative_id)).exists():
                raise serializers.ValidationError({"cooperative_id": "Cooperative ID already registered."})

        return attrs
    def create(self, validated_data):
        password = validated_data.pop('password')

        groups = validated_data.pop('groups', None)
        user_permissions = validated_data.pop('user_permissions', None)

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if groups is not None:
            user.groups.set(groups)

        if user_permissions is not None:
            user.user_permissions.set(user_permissions)

        return user




class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})


class STKPushSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    account_reference = serializers.CharField()
    transaction_desc = serializers.CharField()


class CreditScoreInputSerializer(serializers.Serializer):
    livestock_number = serializers.IntegerField(min_value=1, max_value=30)
    monthly_income = serializers.FloatField(min_value=0)
    max_income = serializers.FloatField(min_value=0.01)
    repayment_status = serializers.ChoiceField(choices=['on_time', 'minor_delay', 'major_delay'])


class CreditScoreOutputSerializer(serializers.Serializer):
    national_id = serializers.CharField(source='user.national_id')
    credit_score = serializers.DecimalField(max_digits=6, decimal_places=2)
    max_eligible_loan = serializers.IntegerField()


class LoanCreateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(type='farmer'),
        required=True,
    )
    amount_requested = serializers.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        model = Loan
        fields = ['amount_requested', 'purpose', 'user']

    def _get_latest_repayment_status(self, user):
        latest_repayment = user.loan_repayments.order_by('-due_date').first()
        if latest_repayment:
            return latest_repayment.repayment_status()
        return 'on_time'

    def validate(self, attrs):
        user = attrs.get('user')
        amount_requested = attrs.get('amount_requested')

        if user.type != 'farmer':
            raise serializers.ValidationError("Only farmers can apply for loans.")

        farmer_wealth = FarmerWealth.objects.filter(user=user).first()
        if not farmer_wealth:
            raise serializers.ValidationError("No FarmerWealth data found for this farmer.")

        if farmer_wealth.livestock_number is None or farmer_wealth.income is None:
            raise serializers.ValidationError("FarmerWealth data is incomplete (missing livestock_number or income).")

        repayment_status = self._get_latest_repayment_status(user)
        max_income = 60000

        credit_score = calculate_credit_score(
            user=user,
            livestock_number=farmer_wealth.livestock_number,
            monthly_income=farmer_wealth.income,
            max_income=max_income,
            repayment_status=repayment_status,
        )
        credit_score = round(Decimal(credit_score), 2)

        max_eligible_amount = Decimal(determine_max_loan_amount(float(credit_score)))

        attrs['credit_score_at_application'] = credit_score

        if amount_requested > max_eligible_amount:
            raise serializers.ValidationError({
                'amount_requested': (
                    f"Requested amount {amount_requested} exceeds max eligible loan amount "
                    f"{max_eligible_amount} for credit score ({credit_score})."
                )
            })

        if amount_requested > 1000000:
            raise serializers.ValidationError({
                'amount_requested': "Maximum allowed loan amount is 1,000,000 KSH."
            })

        return attrs

    def create(self, validated_data):
        credit_score = validated_data.pop('credit_score_at_application', None)

        loan = Loan(**validated_data)
        loan.credit_score_at_application = credit_score
        loan.status = 'pending_approval'
        loan.current_outstanding_balance = Decimal('0.00')

        loan.full_clean()
        loan.save()
        return loan


class LoanOutputSerializer(serializers.ModelSerializer):
    user_type = serializers.CharField(source='user.type', read_only=True)
    national_id = serializers.CharField(source='user.national_id', read_only=True)
    user_fullname = serializers.CharField(source='user.fullname', read_only=True)
    credit_score_at_application = serializers.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        model = Loan
        fields = [
            'loan_id',
            'national_id',
            'user_fullname',
            'user_type',
            'amount_requested',
            'amount_approved',
            'credit_score_at_application',
            'status',
            'application_date',
            'approval_date',
            'payment_deadline',
        ]
