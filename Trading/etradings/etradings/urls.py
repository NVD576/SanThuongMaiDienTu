from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('tradings.urls')),
    # path('admin/', admin.site.urls),
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
]+ static(settings.STATIC_URL, document_root=settings.MEDIA_ROOT)
