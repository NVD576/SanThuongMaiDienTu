from django.contrib import admin
from django.db.models import Count, Sum, Case, When, F, IntegerField, DecimalField
from django.template.response import TemplateResponse
from django.utils.html import mark_safe
from django.contrib.auth import get_user_model
from django import forms
from django.utils.html import format_html
from .models import *
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Store, Order, OrderItem
import json
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
        return mark_safe("<img src='/static/{img_url}' alt='{alt}'/>".format(img_url=obj.image.name, alt=obj.image))


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
        ] + super().get_urls()

    def store_stats(self, request):
        now = timezone.now()
        quarter = (now.month - 1) // 3 + 1

        def decimal_to_float(value):
            return float(value) if value else 0


        orders_data = {
            "month": Order.objects.filter(created_at__month=now.month, status='completed').count(),
            "quarter": Order.objects.filter(created_at__quarter=quarter, status='completed').count(),
            "year": Order.objects.filter(created_at__year=now.year, status='completed').count(),
        }

        stores_stats = Store.objects.annotate(
            total_sales=Sum(F('products__order_items__quantity') * F('products__order_items__price')),
            total_orders=Count('products__order_items__order', distinct=True),
            total_products_sold=Sum('products__order_items__quantity')
        ).values('name', 'total_sales', 'total_orders', 'total_products_sold')

        stores_data = [
            {
                "name": store["name"],
                "total_sales": decimal_to_float(store["total_sales"]),
                "total_orders": store["total_orders"],
                "total_products_sold": store["total_products_sold"],
            }
            for store in stores_stats
        ]

        context = {
            "orders_data": json.dumps(orders_data),
            "stores_data": json.dumps(stores_data),
        }

        return TemplateResponse(request, "admin/store-stats.html", context)


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