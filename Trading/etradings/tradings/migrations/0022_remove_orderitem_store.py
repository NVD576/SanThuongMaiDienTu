from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tradings', '0021_merge_20250131_0914'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderitem',
            name='store',
        ),
    ]
