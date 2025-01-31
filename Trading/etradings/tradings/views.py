from contextlib import nullcontext
from rest_framework.decorators import api_view
from MySQLdb.constants.CR import NULL_POINTER
from django.shortcuts import render
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
import django_filters
from rest_framework.permissions import BasePermission

from .models import Store, User, Product, Category, Review, Transaction, Order, Chat, OrderItem
from .serializers import StoreSerializer, UserSerializer, ProductSerializer, CategorySerializer, ReviewSerializer, TransactionSerializer, OrderSerializer, OrderItemSerializer, ChatSerializer


class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'seller' and request.user.approval_status


@api_view(['GET', 'POST'])
def manage_sellers(request):
    if request.method == 'GET':
        # Lấy danh sách người bán đang chờ phê duyệt
        pending_sellers = User.objects.filter(role='seller', approval_status='pending')
        sellers_data = [
            {
                'id': seller.id,
                'username': seller.username,
                'email': seller.email,
                'avatar': seller.avatar.url if seller.avatar else None,
                'approval_status': seller.approval_status,
            } for seller in pending_sellers
        ]
        return Response(sellers_data)

    elif request.method == 'POST':
        # Phê duyệt hoặc từ chối người bán
        user_id = request.data.get('user_id')
        status = request.data.get('status', 'rejected')  # 'approved' hoặc 'rejected'

        try:
            seller = User.objects.get(id=user_id, role='seller')

            if status == 'approved':
                seller.approval_status = 'approved'
            else:
                seller.approval_status = 'rejected'

            seller.save()
            return Response({"message": f"Tài khoản {seller.username} đã được cập nhật trạng thái thành công."})

        except User.DoesNotExist:
            return Response({"error": "Tài khoản không tồn tại hoặc không phải là tiểu thương."}, status=404)


class RegisterUserView(APIView):

    parser_classes = (MultiPartParser, FormParser)

    # def post(self, request, *args, **kwargs):
    #     serializer = UserSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request, *args, **kwargs):
        data = request.data
        role = data.get('role', 'Buyer')  # Lấy role từ request
        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()
            if role == 'Seller':
                user.approval_status = False  # Mặc định cần phê duyệt
                user.save()
                return Response(
                    {"message": "Đăng ký thành công! Vui lòng chờ phê duyệt để đăng bán sản phẩm."},
                    status=status.HTTP_201_CREATED
                )
            return Response({"message": "Đăng ký thành công!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser ]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'],url_path='current-user',detail=False)
    def get_current_user(self, request):
        return Response(UserSerializer(request.user).data)


class StoresViewSet(viewsets.ModelViewSet):
    # queryset = Store.objects.filter(active=True)
    queryset = Store.objects.filter(active=True).order_by('id')
    serializer_class = StoreSerializer
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #
    #     return [permissions.IsAuthenticated()]

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(active=True).order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #
    #     return [permissions.IsAuthenticated()]

class ProductFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name='category__id', lookup_expr='exact')
    queryset = Product.objects.prefetch_related('reviews')
    class Meta:
        model = Product
        fields = ['category']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(active=True).order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = ProductFilter
    filter_backends = (DjangoFilterBackend, )

    # @action(methods=['post'], detail=True, url_path="hide-product", url_name="hide-product")
    # def hide_product(self, request, pk):
    #     try:
    #         p = Product.objects.get(pk=pk)
    #         p.active = False
    #         p.save()
    #     except Product.DoesNotExist:
    #         return Response(status=HTTP_400_BAD_REQUEST)
    #
    #     return Response(data=ProductSerializer(p, context={'request': request}).data,status=HTTP_200_OK)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:  # Cho phép mọi người xem sản phẩm
            return [permissions.AllowAny()]
        # elif self.action in ['create', 'hide_product']:  # Chỉ seller được phép
        #     return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    @action(methods=['post'], detail=True, url_path="hide-product", url_name="hide-product")
    def hide_product(self, request, pk):
        try:
            p = Product.objects.get(pk=pk, seller=request.user)  # Kiểm tra quyền sở hữu
            p.active = False
            p.save()
        except Product.DoesNotExist:
            return Response(status=HTTP_400_BAD_REQUEST)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter().order_by('id')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    # def perform_create(self, serializer):
    #
    #     # Kiểm tra nếu người dùng chưa đăng nhập
    #     if not self.request.user.is_authenticated:
    #         raise PermissionDenied("You must be logged in to create a review.")
    #
    #     # Đảm bảo người dùng đang đăng nhập được tạo review
    #     serializer.save(user=self.request.user)


    # def get_permissions(self):
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #
    #     return [permissions.IsAuthenticated()]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.filter().order_by('id')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:  # Người dùng có thể xem đơn hàng của họ
    #         return [permissions.IsAuthenticated()]
    #     elif self.action in ['create', 'update', 'destroy']:  # Chỉ seller được chỉnh sửa
    #         return [permissions.IsAuthenticated(), IsSeller()]
    #     return [permissions.IsAuthenticated()]


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.filter().order_by('id')
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #
    #     return [permissions.IsAuthenticated()]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.filter().order_by('id')
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #     return [permissions.IsAuthenticated()]

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.filter().order_by('id')
    serializer_class = ChatSerializer
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #     return [permissions.IsAuthenticated()]