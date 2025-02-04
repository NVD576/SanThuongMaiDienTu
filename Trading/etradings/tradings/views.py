from rest_framework.decorators import api_view
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
import django_filters
from rest_framework.permissions import BasePermission
from django.db.models import Sum, Count, F, IntegerField, Case, When
from .models import *
from .serializers import StoreSerializer, UserSerializer, ProductSerializer, CategorySerializer, ReviewSerializer, TransactionSerializer, OrderSerializer, OrderItemSerializer, ChatSerializer


class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'seller' and request.user.approval_status


@api_view(['GET', 'PATCH'])
def manage_sellers(request, pk=None):
    if request.method == 'GET':
        # Lấy danh sách người bán đang chờ phê duyệt
        try:
            pending_sellers = User.objects.filter(role='seller', approval_status='pending')

            if not pending_sellers:
                return Response({"error": "Không có seller nào chờ duyệt."}, status=404)

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

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    elif request.method == 'PATCH':
        # Cập nhật trạng thái của seller
        status = request.data.get('status', 'rejected')  # 'approved' hoặc 'rejected'

        try:
            seller = User.objects.get(id=pk, role='seller')

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
        role = data.get('role', 'buyer')  # Lấy role từ request
        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()
            if role == 'seller':
                user.approval_status = 'pending'  # Mặc định cần phê duyệt
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

class SalesStatisticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        now = timezone.now()

        sales_month = OrderItem.objects.filter(
            order__created_at__month=now.month,
            order__status='completed'
        ).aggregate(total_sales_month=Sum(F('quantity') * F('price')))

        quarter = (now.month - 1) // 3 + 1
        sales_quarter = OrderItem.objects.filter(
            order__created_at__quarter=quarter,
            order__status='completed'
        ).aggregate(total_sales_quarter=Sum(F('quantity') * F('price')))

        sales_year = OrderItem.objects.filter(
            order__created_at__year=now.year,
            order__status='completed'
        ).aggregate(total_sales_year=Sum(F('quantity') * F('price')))

        sales_month_value = sales_month.get('total_sales_month', 0) or 0
        sales_quarter_value = sales_quarter.get('total_sales_quarter', 0) or 0
        sales_year_value = sales_year.get('total_sales_year', 0) or 0

        stores_stats = Store.objects.annotate(
            total_sales_month=Sum(
                Case(
                    When(
                        products__order_items__order__created_at__month=now.month,
                        then=F('products__order_items__quantity') * F('products__order_items__price')
                    ),
                    default=0,
                    output_field=IntegerField()
                )
            ),
            total_sales_quarter=Sum(
                Case(
                    When(
                        products__order_items__order__created_at__quarter=quarter,
                        then=F('products__order_items__quantity') * F('products__order_items__price')
                    ),
                    default=0,
                    output_field=IntegerField()
                )
            ),
            total_sales_year=Sum(
                Case(
                    When(
                        products__order_items__order__created_at__year=now.year,
                        then=F('products__order_items__quantity') * F('products__order_items__price')
                    ),
                    default=0,
                    output_field=IntegerField()
                )
            ),
            total_products_sold_month=Sum(
                Case(
                    When(
                        products__order_items__order__created_at__month=now.month,
                        then=F('products__order_items__quantity')
                    ),
                    default=0,
                    output_field=IntegerField()
                )
            ),
            total_products_sold_quarter=Sum(
                Case(
                    When(
                        products__order_items__order__created_at__quarter=quarter,
                        then=F('products__order_items__quantity')
                    ),
                    default=0,
                    output_field=IntegerField()
                )
            ),
            total_products_sold_year=Sum(
                Case(
                    When(
                        products__order_items__order__created_at__year=now.year,
                        then=F('products__order_items__quantity')
                    ),
                    default=0,
                    output_field=IntegerField()
                )
            )
        )

        return Response({
            'sales_month': f"{sales_month_value} VND",
            'sales_quarter': f"{sales_quarter_value} VND",
            'sales_year': f"{sales_year_value} VND",
            'stores_stats': list(stores_stats.values(
                'name',
                'total_sales_month',
                'total_sales_quarter',
                'total_sales_year',
                'total_products_sold_month',
                'total_products_sold_quarter',
                'total_products_sold_year'
            ))
        })

class StatisticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user

        # Kiểm tra nếu người dùng là seller
        if user.role == 'seller':
            # Nếu là seller, chỉ hiển thị thống kê của chính mình
            stores_stats = Store.objects.filter(seller=user).annotate(
                total_sales_month=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__month=timezone.now().month,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_sales_quarter=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__quarter=(timezone.now().month - 1) // 3 + 1,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_sales_year=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__year=timezone.now().year,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                )
            )

            categories_stats = Category.objects.filter(products__store__seller=user).annotate(
                total_cates_month=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__month=timezone.now().month,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_cates_quarter=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__quarter=(timezone.now().month - 1) // 3 + 1,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_cates_year=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__year=timezone.now().year,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                )
            ).distinct()

        elif user.role == 'admin':
            # Nếu là admin, hiển thị thống kê của tất cả người bán
            stores_stats = Store.objects.all().annotate(
                total_sales_month=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__month=timezone.now().month,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_sales_quarter=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__quarter=(timezone.now().month - 1) // 3 + 1,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_sales_year=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__year=timezone.now().year,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                )
            )

            categories_stats = Category.objects.all().annotate(
                total_cates_month=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__month=timezone.now().month,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_cates_quarter=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__quarter=(timezone.now().month - 1) // 3 + 1,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                ),
                total_cates_year=Sum(
                    Case(
                        When(
                            products__order_items__order__created_at__year=timezone.now().year,
                            then=F('products__order_items__quantity') * F('products__order_items__price')
                        ),
                        default=0,
                        output_field=IntegerField()
                    )
                )
            ).distinct()

        else:
            return Response({"error": "Bạn không có quyền truy cập"}, status=403)

        return Response({
            'stores_stats': list(stores_stats.values(
                'name',
                'total_sales_month',
                'total_sales_quarter',
                'total_sales_year'
            )),
            'categories_stats': list(categories_stats.values(
                'name',
                'total_cates_month',
                'total_cates_quarter',
                'total_cates_year'
            ))
        })



