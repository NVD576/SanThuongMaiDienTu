from contextlib import nullcontext

from MySQLdb.constants.CR import NULL_POINTER
from django.shortcuts import render
from rest_framework import viewsets, permissions, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK
from rest_framework.parsers import MultiPartParser

from .models import Store, User, Product, Category, Review, Transaction, Order, Chat, OrderItem
from .serializers import StoreSerializer, UserSerializer, ProductSerializer, CategorySerializer, ReviewSerializer, TransactionSerializer, OrderSerializer, OrderItemSerializer, ChatSerializer

class UserViewSet(viewsets.ModelViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser ]

    def get_permissions(self):
        if self.action == 'retrieve':
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

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

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(active=True).order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    @action(methods=['post'], detail=True, url_path="hide-product", url_name="hide-product")
    def hide_product(self, request, pk):
        try:
            p = Product.objects.get(pk=pk)
            p.active = False
            p.save()
        except Product.DoesNotExit:
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(data=ProductSerializer(p, context={'request': request}).data,status=HTTP_200_OK)


    # def get_permissions(self):
    #     if self.action == 'list':
    #         return [permissions.AllowAny()]
    #
    #     return [permissions.IsAuthenticated()]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter().order_by('id')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

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
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #
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
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]

    # def get_permissions(self):
    #     if self.action=='list':
    #         return [permissions.AllowAny()]
    #     return [permissions.IsAuthenticated()]