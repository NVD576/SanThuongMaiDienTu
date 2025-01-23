from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *

class UserSerializer(ModelSerializer):
    # avatar = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id','first_name','last_name','email','username','password','role','avatar']
        extra_kwargs = {
            'password':{'write_only': 'true'}
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        return user

    # def get_avatar(self, obj):
    #     if obj.avatar:
    #         # Trả về đường dẫn đầy đủ với STATIC_URL
    #         request = self.context.get('request')  # Lấy thông tin request nếu cần
    #         return f"{request.scheme}://{request.get_host()}/static/{obj.avatar.name}"
    #     return None


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


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at', 'active']

class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ["id","store","name","description","price","category","stock_quantity","image"]

class ReviewSerializer(ModelSerializer):
    class Meta:
        model = Review
        fields= ["id","product", "user", "rating", "comment", "created_at"]