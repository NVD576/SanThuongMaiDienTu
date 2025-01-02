from django.contrib import admin
from .models import Store, Product, User, Review, Order, OrderItem, Transaction, Chat
# Register your models here.

admin.site.register(Store)
admin.site.register(Product)
admin.site.register(User)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Transaction)
admin.site.register(Chat)