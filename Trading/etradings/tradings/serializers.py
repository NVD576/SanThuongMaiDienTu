from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ImageField,StringRelatedField
from .models import *

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ['id','first_name','last_name','email','username','password','role','avatar','approval_status']
        # fields ="__all__"
        extra_kwargs = {
            'password':{'write_only': 'True'}
        }


    def create(self, validated_data):
        role = validated_data.get('role', 'buyer').lower()

        # Nếu user đăng ký là seller thì đặt approval_status thành 'pending'
        if role == 'seller':
            validated_data['approval_status'] = 'pending'
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()

        return user

    # def get_avatar(self, obj):
    #     if obj.avatar:
    #         # Trả về đường dẫn đầy đủ với STATIC_URL
    #         request = self.context.get('request')  # Lấy thông tin request nếu cần
    #         if request and obj.avatar:
    #             # return request.build_absolute_uri('/static/' % obj.avatar)
    #             return request.build_absolute_uri(f'/static/{obj.avatar.name}')
    #         # return f"{request.scheme}://{request.get_host()}/static/{obj.avatar.name}"
    #     return None


class StoreSerializer(ModelSerializer):
    # seller = UserSerializer()

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


class ReviewSerializer(ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Cung cấp queryset cho user
    responses = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = "__all__"
        # fields= ["id","product", "user", "rating", "comment", "created_at"]
    # def get_user(self, obj):
    #     # Trả về tên người dùng hoặc bất kỳ thuộc tính nào của đối tượng User
    #     return obj.user.username
    def get_responses(self, obj):
        # Trả về các phản hồi cho bình luận này nếu có
        responses = obj.responses.all()
        return ReviewSerializer(responses, many=True).data

    def to_representation(self, instance):
        """
        Override the to_representation method to display the user's username
        instead of the user ID.
        """
        representation = super().to_representation(instance)
        representation['user'] = instance.user.username  # Hiển thị tên người dùng thay vì ID
        return representation

class ProductSerializer(ModelSerializer):
    # image = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = "__all__"
    # def get_image(self, obj):
    #     if obj.image:
    #         # Trả về đường dẫn đầy đủ với STATIC_URL
    #         request = self.context.get('request')  # Lấy thông tin request nếu cần
    #         return f"{request.scheme}://{request.get_host()}/static/{obj.image.name}"
    #     return None


class OrderSerializer(ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"

class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"

class ChatSerializer(ModelSerializer):
    class Meta:
        model = Chat
        fields = "__all__"
