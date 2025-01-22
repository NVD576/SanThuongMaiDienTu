from contextlib import nullcontext

from MySQLdb.constants.CR import NULL_POINTER
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_200_OK

from .models import Store, User, Product
from .serializers import StoreSerializer, UserSerializer, ProductSerializer

class StoresViewSet(viewsets.ModelViewSet):
    # queryset = Store.objects.filter(active=True)
    queryset = Store.objects.filter(active=True).order_by('id')
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action=='list':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class UsersViewSet(viewsets.ModelViewSet):
    queryset = User.objects.order_by('id')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action=='list':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(active=True).order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['post'], detail=True, url_path="hide-product", url_name="hide-product")
    def hide_product(self, request, pk):
        try:
            p = Product.objects.get(pk=pk)
            p.active = False
            p.save()
        except Product.DoesNotExit:
            return Response(status=HTTP_400_BAD_REQUEST)

        return Response(data=ProductSerializer(p, context={'request': request}).data,status=HTTP_200_OK)


    def get_permissions(self):
        if self.action == 'list':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

# Create your views here.

