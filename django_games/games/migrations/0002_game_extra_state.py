# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-03-23 06:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='extra_state',
            field=models.CharField(blank=True, max_length=1000),
        ),
    ]