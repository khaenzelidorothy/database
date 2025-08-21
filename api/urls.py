from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token

from .views import (
    RegisterUserView,
    LoginUserView,
    DocumentViewSet,
    LoanViewSet,
    CooperativePartnerBankViewSet,
    UserViewSet,
    LoanRepaymentViewSet,
    STKPushView,
    daraja_callback,
    FarmerWealthViewSet,
    CreditScoreViewSet,
)

router = DefaultRouter()
router.register(r'credit_score', CreditScoreViewSet, basename='credit_score')
router.register(r'loans', LoanViewSet, basename='loans')
router.register(r'loan_repayments', LoanRepaymentViewSet, basename="loan_repayments")
router.register(r'documents', DocumentViewSet, basename="documents")
router.register(r'cooperative_partner_banks', CooperativePartnerBankViewSet, basename="bankpartners")
router.register(r'farmer_wealth', FarmerWealthViewSet, basename="farmer_wealth")
router.register(r'users', UserViewSet, basename="users")

auth_urls = [
    path('login/', LoginUserView.as_view(), name='login'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('disbursement/stk-push/', STKPushView.as_view(), name='disbursement-stk-push'),
    path('disbursement/callback/', daraja_callback, name='disbursement-callback'),
    path('auth/', include((auth_urls, 'auth'))),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
