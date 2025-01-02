from django.db import models
from django.contrib.auth.models import AbstractUser

# User Model (Abstract)
class User(AbstractUser ):
    username = models.CharField(max_length=150, unique=True, null=False)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return self.username


# Seller Model (Inherits User)
class Seller(User):
    business_name = models.CharField(max_length=255, blank=True, null=True)
    verified = models.BooleanField(default=False)  # Cần sự xác nhận của nhân viên hệ thống

    def __str__(self):
        return f"Seller: {self.business_name or self.username}"


# Buyer Model (Inherits User)
class Buyer(User):
    def __str__(self):
        return f"Buyer: {self.username}"


# Employee Model (Inherits User)
class Employee(User):
    department = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"Employee: {self.username}"


# Admin Model (Inherits User)
class Admin(User):
    def __str__(self):
        return f"Admin: {self.username}"


# Store Model
class Store(models.Model):
    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name='stores')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    rating = models.FloatField(default=0.0)
    image = models.ImageField(upload_to='stores/', null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# Product Model
class Product(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    stock_quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# Review Model
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"


# Order Model
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"


# OrderItem Model
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


# Transaction Model
class Transaction(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='transaction')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transaction for Order {self.order.id}"


# Chat Model (Real-time chat integration, could use Firebase)
class Chat(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField(max_length=200,null=False )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username}"


# Function to handle product filtering and pagination
def filter_and_paginate_products(queryset, page_number=1, products_per_page=20):
    from django.core.paginator import Paginator
    paginator = Paginator(queryset, products_per_page)
    page = paginator.get_page(page_number)
    return page
