# Generated by Django 3.2.23 on 2024-01-25 17:47

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("smartcontract", "0008_alter_smartcontract_chain"),
    ]

    operations = [
        migrations.AlterField(
            model_name="smartcontract",
            name="address",
            field=models.CharField(max_length=44),
        ),
    ]
