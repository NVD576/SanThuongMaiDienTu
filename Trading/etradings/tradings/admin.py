from django.contrib import admin
from django.utils.html import mark_safe
from django import forms
from .models import Store, Product, User, Review, Order, OrderItem, Transaction, Chat, Seller
from ckeditor_uploader.widgets import CKEditorUploadingWidget
# Register your models here.


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

class LessonStore(admin.ModelAdmin):
    list_display = ["name","rating","created_at","active"]
    search_fields = ["name"]
    list_filter = ["rating"]
    form = StoreForm

class LessonProduct(admin.ModelAdmin):
    list_display = ["store","name","price","category","stock_quantity","created_at","active"]
    search_fields = ["store","name"]
    list_filter = ["category"]
    form = ProductForm

class LessonUser(admin.ModelAdmin):
    class Media:
        css={
            'all':('/static/css/main.css',)
        }

    list_display = ["username","role"]
    search_fields = ["username","role"]
    list_filter = ["role"]
    readonly_fields = ["avatar"]

    def avatar(self, obj):
            return mark_safe("<img src='/static/avatars/{img_url}' alt='{alt}'/>".format(img_url=obj.avatar.name, alt=obj.avatar))

class LessonSeller(admin.ModelAdmin):
    list_display = ["user","business_name"]
    search_fields = ["user","business_name"]

class LessonReview(admin.ModelAdmin):
    list_display = ["user","product","rating","created_at"]
    search_fields = ["user","product"]
    list_filter = ["rating"]

class LessonOrder(admin.ModelAdmin):
    list_display = ["user","total_price","payment_method","status","created_at"]
    search_fields = ["user","total_price","payment_method"]

class LessonOrderItem(admin.ModelAdmin):
    list_display = ["order","product","quantity","price"]
    search_fields = ["order","product","quantity","price"]

class LessonTransaction(admin.ModelAdmin):
    list_display = ["order","amount","method","status","created_at"]
    search_fields = ["order","amount","method"]

class LessonChat(admin.ModelAdmin):
    list_display = ["sender","receiver","timestamp"]
    search_fields = ["sender","receiver","timestamp"]

admin.site.register(Store, LessonStore)
admin.site.register(Product, LessonProduct)
admin.site.register(User, LessonUser)
admin.site.register(Seller, LessonSeller)
admin.site.register(Review, LessonReview)
admin.site.register(Order, LessonOrder)
admin.site.register(OrderItem, LessonOrderItem)
admin.site.register(Transaction, LessonTransaction)
admin.site.register(Chat, LessonChat)