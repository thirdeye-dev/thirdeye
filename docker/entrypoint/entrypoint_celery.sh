#!/bin/sh

cd /app/backend

exec celery -A backend.celery worker --loglevel=info --without-mingle -Ofair --autoscale=10,1
