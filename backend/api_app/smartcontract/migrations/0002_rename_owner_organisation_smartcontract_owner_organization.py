# Generated by Django 3.2.18 on 2023-04-05 14:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('smartcontract', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='smartcontract',
            old_name='owner_organisation',
            new_name='owner_organization',
        ),
    ]
