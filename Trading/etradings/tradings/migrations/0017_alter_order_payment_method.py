# Generated by Django 5.1.4 on 2025-01-30 15:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tradings', '0016_user_approval_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='payment_method',
            field=models.CharField(choices=[('money', 'Tiền mặt'), ('papal', 'Papal'), ('stripe', 'Stripe'), ('zalopay', 'ZaloPay'), ('momo', 'Momo')], default='money', max_length=50),
        ),
    ]
