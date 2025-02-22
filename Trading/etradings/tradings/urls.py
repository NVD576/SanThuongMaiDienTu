from django.urls import path, re_path, include
from . import views
from . admin import admin_site
from rest_framework.routers import DefaultRouter
from oauth2_provider.views import TokenView
from .views import SalesStatisticsView, StatisticsView



router = DefaultRouter()
router.register('stores',views.StoresViewSet)
router.register('users',views.UserViewSet)
router.register('products',views.ProductViewSet)
router.register('categories', views.CategoryViewSet)
router.register('reviews', views.ReviewViewSet)
router.register('orders', views.OrderViewSet)
router.register('orderItems', views.OrderItemViewSet)
router.register('transactions', views.TransactionViewSet)
router.register('chat', views.ChatViewSet)


from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', include(router.urls)),
    path('users/<int:pk>/', views.UserViewSet.as_view({'get': 'retrieve'}), name='user-detail'),
    path('users/', views.UserViewSet.as_view({'post': 'create'}), name='user-create'),
    # re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    path('admin/',admin_site.urls),
    path('o/token/', TokenView.as_view(), name='token'),
    path('api/register/', views.RegisterUserView.as_view(), name='register'),
    path('manage_sellers/', views.manage_sellers, name='get-manage_sellers'),
    path('manage_sellers/<int:pk>/', views.manage_sellers, name='manage_seller'),
    path('sales-statistics/', SalesStatisticsView.as_view(), name='sales-statistics'),
    path('statistics/', StatisticsView.as_view(), name='statistics'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
