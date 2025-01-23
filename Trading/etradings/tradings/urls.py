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

urlpatterns = [
    path('', include(router.urls)),
    path('users/<int:pk>/', views.UserViewSet.as_view({'get': 'retrieve'}), name='user-detail'),
    path('users/', views.UserViewSet.as_view({'post': 'create'}), name='user-create'),
    # re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    path('admin/',admin_site.urls)
]
