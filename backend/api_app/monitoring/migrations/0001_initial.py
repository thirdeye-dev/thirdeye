# Generated by Django 3.2.18 on 2023-04-02 23:56

from django.db import migrations, models
import django.db.models.deletion
import yamlfield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('smartcontract', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='MonitoringTasks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('task_id', models.CharField(blank=True, max_length=255, null=True, unique=True)),
                ('task_status', models.CharField(choices=[('RUNNING', 'Running'), ('PENDING', 'Pending'), ('STOPPED', 'Stopped')], default='PENDING', max_length=16)),
                ('SmartContract', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='smartcontract.smartcontract')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Alerts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('alert_yaml', yamlfield.fields.YAMLField()),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('smart_contract', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='smartcontract.smartcontract')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
