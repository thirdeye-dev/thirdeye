# Generated by Django 3.2.18 on 2023-03-25 22:44

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("monitoring", "0004_alter_monitoringtasks_task_status"),
    ]

    operations = [
        migrations.AlterField(
            model_name="monitoringtasks",
            name="task_id",
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
