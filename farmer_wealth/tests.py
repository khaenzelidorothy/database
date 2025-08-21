from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from farmer_wealth.models import FarmerWealth


class SimpleFarmerWealthTest(APITestCase):


   def test_list_farmer_wealth(self):
      
       response = self.client.get(self.list_url)
       self.assertEqual(response.status_code, status.HTTP_200_OK)
       self.assertIsInstance(response.data, list)


   def test_create_farmer_wealth(self):
     
       data = {
           "farmer": self.farmer.farmer_id,
           "milk_quantity": "100 liters",
           "income": "5000.00"
       }
       response = self.client.post(self.list_url, data, format='json')
       self.assertEqual(response.status_code, status.HTTP_201_CREATED)
     
       self.assertEqual(FarmerWealth.objects.count(), 1)
       self.assertEqual(FarmerWealth.objects.first().milk_quantity, "100 liters")
