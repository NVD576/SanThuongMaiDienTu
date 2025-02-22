# Generated by Django 5.1.4 on 2025-01-30 14:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tradings', '0018_alter_order_total_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='store',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='tradings.store'),
            preserve_default=False,
        ),
    ]
