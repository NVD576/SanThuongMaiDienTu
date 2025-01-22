from django.contrib import admin
from django.db import router
from django.urls import path, re_path, include
from . import views
from . admin import admin_site
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('stores',views.StoresViewSet)
router.register('users',views.UsersViewSet)
router.register('products',views.ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    path('admin/',admin_site.urls)
]
