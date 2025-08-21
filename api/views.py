from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from users.models import User
from farmerLoan.models import Loan
from farmer_wealth.models import FarmerWealth
from rest_framework.authtoken.models import Token

from .serializers import (
    FarmerWealthSerializer,
    LoanRepaymentSerializer,
    DocumentSerializer,
    CooperativePartnerBankSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    STKPushSerializer,
    LoanCreateSerializer,
    LoanOutputSerializer,
    CreditScoreInputSerializer,
    CreditScoreOutputSerializer,
)
from .disbursment import DarajaAPI
from api.credit import calculate_credit_score, determine_max_loan_amount

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.core.exceptions import ValidationError


class FarmerWealthViewSet(viewsets.ModelViewSet):
    queryset = FarmerWealth.objects.all()
    serializer_class = FarmerWealthSerializer
    permission_classes = [AllowAny]


class LoanRepaymentViewSet(viewsets.ModelViewSet):
    queryset = LoanRepaymentSerializer.Meta.model.objects.all()
    serializer_class = LoanRepaymentSerializer
    permission_classes = [AllowAny]


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = DocumentSerializer.Meta.model.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [AllowAny]


class CooperativePartnerBankViewSet(viewsets.ModelViewSet):
    queryset = CooperativePartnerBankSerializer.Meta.model.objects.all()
    serializer_class = CooperativePartnerBankSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return LoanCreateSerializer
        return LoanOutputSerializer


class STKPushView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = STKPushSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            daraja = DarajaAPI()
            response = daraja.stk_push(
                phone_number=data['phone_number'],
                amount=data['amount'],
                account_reference=data['account_reference'],
                transaction_desc=data['transaction_desc']
            )
            return Response(response)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def daraja_callback(request):
    callback_data = request.data
    print("Daraja Callback Data:", callback_data)

    try:
        stk_callback = callback_data['Body']['stkCallback']
        checkout_request_id = stk_callback['CheckoutRequestID']
        result_code = stk_callback['ResultCode']
        result_desc = stk_callback['ResultDesc']
        print(f"CheckoutRequestID: {checkout_request_id}, ResultCode: {result_code}, ResultDesc: {result_desc}")

        if result_code == 0:
            items = stk_callback.get('CallbackMetadata', {}).get('Item', [])
            item_dict = {item['Name']: item['Value'] for item in items}
            print(f"Payment Metadata: {item_dict}")

    except Exception as e:
        print(f"Error processing Daraja callback: {e}")

    return Response({"ResultCode": 0, "ResultDesc": "Accepted"})


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_type': user.type}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            password = serializer.validated_data['password']
            try:
                user = User.objects.get(phone_number=phone_number)
            except User.DoesNotExist:
                return Response({'error': 'Invalid phone number or password.'}, status=status.HTTP_401_UNAUTHORIZED)
            if user.check_password(password):
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key, 'user_type': user.type}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid phone number or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreditScoreViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def calculate(self, request):
        serializer = CreditScoreInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user_id = request.data.get("user_id")

        user = None
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                return Response({'detail': 'User not found.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user:
            return Response({'detail': 'User id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            farmer_wealth = FarmerWealth.objects.filter(user=user).order_by('-farmer_wealth_id').first()
            if not farmer_wealth:
                return Response({"detail": "No FarmerWealth data found for this farmer."}, status=status.HTTP_400_BAD_REQUEST)
            if farmer_wealth.livestock_number is None or farmer_wealth.income is None:
                return Response({"detail": "FarmerWealth data is incomplete."}, status=status.HTTP_400_BAD_REQUEST)
            credit_score = calculate_credit_score(
                user=user,
                livestock_number=farmer_wealth.livestock_number,
                monthly_income=farmer_wealth.income,
                max_income=data['max_income'],
                repayment_status=data['repayment_status']
            )
            max_loan = determine_max_loan_amount(credit_score)

            output = {
                'user': user,
                'credit_score': Decimal(round(credit_score, 2)),
                'max_eligible_loan': max_loan,
            }
            out_serializer = CreditScoreOutputSerializer(output)
            return Response(out_serializer.data)

        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
