from django.contrib import admin
from django.db.models import Count, Sum
from django.template.response import TemplateResponse
from django.utils.html import mark_safe
from django.contrib.auth import get_user_model
from django import forms
from django.utils.html import format_html
from .models import *
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path
from django.utils.timezone import now
from datetime import datetime, timedelta
from .models import Store, Order, OrderItem
import pandas as pd
from django.http import HttpResponse
# Register your models here.

class ProductInLine(admin.StackedInline):
    model = Product
    pk_name = 'store'

class StoreForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)
    class Meta:
        model = Store
        fields = '__all__'

class ProductForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)
    class Meta:
        model = Product
        fields = '__all__'

class StoreAdmin(admin.ModelAdmin):
    list_display = ["name","rating","created_at","active"]
    search_fields = ["name"]
    list_filter = ["active"]

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "seller":
    #         kwargs["queryset"] = User.objects.filter(role='seller')
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)

    form = StoreForm
    inlines = (ProductInLine,)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'active']
    search_fields = ['name']
    list_filter = ['active']

class ProductAdmin(admin.ModelAdmin):
    list_display = ["store","name","price","category","stock_quantity","rating","created_at","active"]
    search_fields = ["store","name"]
    list_filter = ["active"]
    readonly_fields = ["images"]
    form = ProductForm
    def images(self, obj):
        return mark_safe("<img src='/{img_url}' alt='{alt}'/>".format(img_url=obj.image.name, alt=obj.image))


class UserAdmin(admin.ModelAdmin):
    class Media:
        css={
            'all':('/static/css/main.css',)
        }

    list_display = ["username","role"]
    search_fields = ["username","role"]
    readonly_fields = ["image"]
    list_filter = ["role"]

    def image(self, obj):
        return mark_safe("<img src='/static/{img_url}' alt='{alt}'/>".format(img_url=obj.avatar.name, alt=obj.avatar))

    def save_model(self, request, obj, form, change):
        # Ensure the password is hashed if it's changed or a new user is created
        if obj.password:
            obj.set_password(obj.password)
        obj.save()


class ReviewAdmin(admin.ModelAdmin):
    list_display = ["user","product","rating","created_at"]
    search_fields = ["user","product"]
    list_filter = ["rating"]

class OrderAdmin(admin.ModelAdmin):
    list_display = ["user","total_price","payment_method","status","created_at"]
    search_fields = ["user","total_price","payment_method"]

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["order","product","quantity","price"]
    search_fields = ["order","product","quantity","price"]

class TransactionAdmin(admin.ModelAdmin):
    list_display = ["order","amount","method","status","created_at"]
    search_fields = ["order","amount","method"]

class ChatAdmin(admin.ModelAdmin):
    list_display = ["sender","receiver","timestamp"]
    search_fields = ["sender","receiver","timestamp"]

class StoreAppAdminSite(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ THƯƠNG MẠI"

    def get_urls(self):
        return [
            path('store-stats/', self.store_stats),
            path('store-stats/export/', self.export_stats),
        ] + super().get_urls()

    def store_stats(self, request):
        # Lọc theo thời gian
        time_filter = request.GET.get('time_period', 'month')
        current_year = now().year
        current_month = now().month
        start_date, end_date = None, None

        if time_filter == 'month':
            start_date = datetime(current_year, current_month, 1)
            end_date = start_date + timedelta(days=30)
        elif time_filter == 'quarter':
            quarter = (current_month - 1) // 3 + 1
            start_date = datetime(current_year, 3 * (quarter - 1) + 1, 1)
            end_date = start_date + timedelta(days=90)
        elif time_filter == 'year':
            start_date = datetime(current_year, 1, 1)
            end_date = datetime(current_year, 12, 31)

        # Thống kê số lượng sản phẩm và doanh số theo cửa hàng
        stats = Store.objects.annotate(
            product_count=Count('products'),
            total_sales=Sum('order__total_amount', filter=Order.objects.filter(created_at__range=(start_date, end_date)))
        ).values("name", "rating", "product_count", "total_sales")

        store_count = Store.objects.count()

        return TemplateResponse(request, 'admin/store-stats.html', {
            'store_count': store_count,
            'stats': stats,
            'time_filter': time_filter
        })

    def export_stats(self, request):
        stats = Store.objects.annotate(
            product_count=Count('products'),
            total_sales=Sum('order__total_amount')
        ).values("name", "rating", "product_count", "total_sales")

        df = pd.DataFrame(stats)
        response = HttpResponse(content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename="store_stats.xlsx"'
        df.to_excel(response, index=False)
        return response

admin_site = StoreAppAdminSite('MyApp')

admin_site.register(Store, StoreAdmin)
admin_site.register(Category, CategoryAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(User, UserAdmin)
admin_site.register(Review, ReviewAdmin)
admin_site.register(Order, OrderAdmin)
admin_site.register(OrderItem, OrderItemAdmin)
admin_site.register(Transaction, TransactionAdmin)
admin_site.register(Chat, ChatAdmin)


# admin.site.register(Store, StoreAdmin)
# admin.site.register(Product, ProductAdmin)
# admin.site.register(User, UserAdmin)
# admin.site.register(Seller, SellerAdmin)
# admin.site.register(Review, ReviewAdmin)
# admin.site.register(Order, OrderAdmin)
# admin.site.register(OrderItem, OrderItemAdmin)
# admin.site.register(Transaction, TransactionAdmin)
# admin.site.register(Chat, ChatAdmin)