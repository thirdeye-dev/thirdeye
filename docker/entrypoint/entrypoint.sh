#!/bin/sh

cd /app/backend/

python manage.py makemigrations
python manage.py migrate --no-input
# python manage.py collectstatic --no-input

# daphne backend.asgi:application -b 0.0.0.0 -p 8000
# gunicorn backend.wsgi:application --bind 0.0.0.0:8000 
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 