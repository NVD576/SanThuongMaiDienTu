# from django.contrib import admin
# from django.db import router
from django.urls import path, re_path, include
from . import views
from . admin import admin_site
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('stores',views.StoresViewSet)
router.register('users',views.UserViewSet)
router.register('products',views.ProductViewSet)
router.register('categories', views.CategoryViewSet)
router.register('reviews', views.ReviewViewSet)
router.register('orders', views.OrderViewSet)
router.register('OrderItems', views.OrderItemViewSet)
router.register('Transaction', views.TransactionViewSet)
router.register('Chat', views.ChatViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('users/<int:pk>/', views.UserViewSet.as_view({'get': 'retrieve'}), name='user-detail'),
    path('users/', views.UserViewSet.as_view({'post': 'create'}), name='user-create'),
    # re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    path('admin/',admin_site.urls)
]
