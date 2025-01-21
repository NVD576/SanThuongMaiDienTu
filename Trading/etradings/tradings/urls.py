from django.contrib import admin
from django.urls import path, re_path, include
from . import views
from . admin import admin_site

urlpatterns = [
    path('', views.index, name="index"),
    # re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    path('welcome/', views.welcome, name="welcome"),
    path('admin/',admin_site.urls)
]
