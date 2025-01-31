# Generated by Django 5.1.4 on 2025-01-30 15:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tradings', '0017_alter_order_payment_method'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='store',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='tradings.store'),
            preserve_default=False,
        ),
    ]
