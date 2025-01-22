from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.utils.html import mark_safe
from django import forms
from django.utils.html import format_html
from .models import Store, Product, User, Review, Order, OrderItem, Transaction, Chat
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path
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
    list_filter = ["rating"]

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "seller":
            kwargs["queryset"] = User.objects.filter(role='seller')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    form = StoreForm
    inlines = (ProductInLine,)

class ProductAdmin(admin.ModelAdmin):
    list_display = ["store","name","price","category","stock_quantity","created_at","active"]
    search_fields = ["store","name"]
    list_filter = ["category"]
    form = ProductForm

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
        # if obj.avatar:
        #     # Hiển thị hình ảnh nhỏ nếu có avatar
        #     return format_html(f'<img src="static/{obj.avatar.url}" style="height: 50px;"/>')
        # return "No avatar"

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
    site_header = "HE THONG QUAN LY THUONG MAI"

    def get_urls(self):
        return [
            path('store-stats/', self.store_stats)
        ] + super().get_urls()

    def store_stats(self, request):
        store_count = Store.objects.count()
        stats = Store.objects.annotate(product_count=Count('products')).values("name","rating","product_count")

        return TemplateResponse(request, 'admin/store-stats.html', {
            'store_count' : store_count,
            'stats' : stats
        })

admin_site = StoreAppAdminSite('mystore')

admin_site.register(Store, StoreAdmin)
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