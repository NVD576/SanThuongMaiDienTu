from rest_framework.serializers import ModelSerializer
from .models import Store
class StoreSerializer(ModelSerializer):
    class Meta:
        model = Store
        fields = ["seller","name","description","rating","image","created_at","active"]