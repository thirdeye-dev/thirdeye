# Generated by Django 3.2.18 on 2023-03-25 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monitoring', '0002_alter_monitoringtasks_task_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='monitoringtasks',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='monitoringtasks',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
