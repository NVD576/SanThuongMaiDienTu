from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id","avatar","role","username"]


class StoreSerializer(ModelSerializer):
    seller = UserSerializer()

    class Meta:
        model = Store
        fields = ["id","seller","name","description","rating","image","created_at","active"]

    def validate_seller(self, value):
        """Ensure the seller is a user with role 'seller'."""
        if value.role != "seller":
            raise serializers.ValidationError("The selected user must have the 'seller' role.")
        return value


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image', 'created_at', 'active']

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ["id","store","name","description","price","category","stock_quantity","image"]

class ReviewSerialazier(ModelSerializer):
    class Meta:
        model = Review
        fields= []