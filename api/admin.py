from django.contrib import admin
from bankpartners.models import CooperativePartnerBank
from document.models import Document
from farmer_wealth.models import FarmerWealth
from farmerLoan.models import Loan
from users.models import User


admin.site.register(CooperativePartnerBank)
admin.site.register(Document)
admin.site.register(FarmerWealth)
admin.site.register(Loan)
admin.site.register(User)


