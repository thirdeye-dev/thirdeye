# Generated by Django 3.2.18 on 2023-03-21 09:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SmartContract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('address', models.CharField(max_length=42, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('chain', models.CharField(choices=[('ETH', 'eth')], max_length=16)),
                ('network', models.CharField(choices=[('MAINNET', 'mainnet'), ('SEPOLIA', 'sepolia'), ('GOERLI', 'goerli')], default='MAINNET', max_length=100)),
                ('active', models.BooleanField(default=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
