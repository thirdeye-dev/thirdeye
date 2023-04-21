"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""

import os
from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

DEBUGGING_WALLET = "0xEb87fcc7B227400D157dD976d1C4B18f42dC14fa"

# INFURA_TOKEN
INFURA_PROJECT_ID = os.environ.get("INFURA_PROJECT_ID", "")

# INFURA HTTP goerli endpoint
INFURA_HTTP_ENDPOINT = f"https://goerli.infura.io/v3/{INFURA_PROJECT_ID}"

# mapping of URLs to different ethereum based chains and networks
CHAINS_AND_NETWORKS = {
    "eth": {
        "mainnet": f"wss://mainnet.infura.io/ws/v3/{INFURA_PROJECT_ID}",
        "goerli": f"wss://goerli.infura.io/w3/v3/{INFURA_PROJECT_ID}",
        "sepolia": f"wss://sepolia.infura.io/w3/v3/{INFURA_PROJECT_ID}",
    }
}

# Oauth definitions
AUTHLIB_OAUTH_CLIENTS = {}

AUTHLIB_OAUTH_CLIENTS["google"] = {
    "client_id": os.environ.get("GOOGLE_CLIENT_ID", ""),
    "client_secret": os.environ.get("GOOGLE_CLIENT_SECRET", ""),
}

AUTHLIB_OAUTH_CLIENTS["github"] = {
    "client_id": os.environ.get("GITHUB_CLIENT_ID", ""),
    "client_secret": os.environ.get("GITHUB_CLIENT_SECRET", ""),
}


ALLOWED_HOSTS = ["*"]
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_HEADERS = ["*"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.postgres",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_swagger",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "django_celery_beat",
    "drf_spectacular",
    "django_extensions",
    "authentication",
    "authentication.organizations",
    "api_app",
    "api_app.core",
    "api_app.monitoring",
    "api_app.smartcontract",
]

APPEND_SLASH = False
FRONTEND_URL = "http://localhost:3000/"

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get("SMTP_EMAIL", "")
EMAIL_HOST_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.environ.get("SMTP_EMAIL", "")


SIMPLE_JWT = {
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("JWT",),
    "UPDATE_LAST_LOGIN": True,
    "ACCESS_TOKEN_LIFETIME": timedelta(weeks=1),
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        # enables simple command line authentication
        # "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "PAGE_SIZE": 50,
}

AUTH_USER_MODEL = "authentication.User"


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # for the time being, removing this
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"
DEMO_INSTANCE = True if os.environ.get("DEMO_INSTANCE") == "true" else False

DEMO_ALLOWED_EMAILS = [
    "wolfwithahat@protonmail.com",
]

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-F%yn7%qtGeQFPm5v8N2Gu&7aFHxAqRPXFN24yX",
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False if DEMO_INSTANCE else os.environ.get("DEBUG", "true") == "true"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "main"),
        "USER": os.environ.get("POSTGRES_USER", "user"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "password"),
        "HOST": "postgres",
        "PORT": "5432",
    }
}


if DEMO_INSTANCE:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# APPEND_SLASH = False

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REDIS_PORT = 6379
REDIS_DB = 0
REDIS_HOST = os.environ.get("REDIS_PORT_6379_TCP_ADDR", "redis")

RABBIT_HOSTNAME = os.environ.get("RABBIT_PORT_5672_TCP", "rabbit")

if RABBIT_HOSTNAME.startswith("tcp://"):
    RABBIT_HOSTNAME = RABBIT_HOSTNAME.split("//")[1]

BROKER_URL = os.environ.get("BROKER_URL", "")
if not BROKER_URL:
    BROKER_URL = "amqp://{user}:{password}@{hostname}/{vhost}/".format(
        user=os.environ.get("RABBIT_ENV_USER", "admin"),
        password=os.environ.get("RABBIT_ENV_RABBITMQ_PASS", "mypass"),
        hostname=RABBIT_HOSTNAME,
        vhost=os.environ.get("RABBIT_ENV_VHOST", ""),
    )

# We don't want to have dead connections stored on rabbitmq,
# so we have to negotiate using heartbeats
BROKER_HEARTBEAT = "?heartbeat=60"
if not BROKER_URL.endswith(BROKER_HEARTBEAT):
    BROKER_URL += BROKER_HEARTBEAT

BROKER_POOL_LIMIT = 1
BROKER_CONNECTION_TIMEOUT = 10


# run every 10th minute

# Set redis as celery result backend
CELERY_RESULT_BACKEND = "redis://%s:%d/%d" % (REDIS_HOST, REDIS_PORT, REDIS_DB)
# RESULT_BACKEND = "django-db"
CELERY_REDIS_MAX_CONNECTIONS = 1
CELERY_QUEUES = os.environ.get("CELERY_QUEUES", "default").split(",")

# Don't use pickle as serializer, json is much safer
CELERY_TASK_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["application/json"]

CELERY_TIMEZONE = "UTC"
CELERY_ENABLE_UTC = True

# Spectacular settings
SPECTACULAR_SETTINGS = {
    "TITLE": "ThirdEye",
    "DESCRIPTION": "ThirdEyeEye OpenAPI Documentation",
    "VERSION": "0.0.1",
    "SERVE_INCLUDE_SCHEMA": False,
    "SERVERS": [
        {"url": "http://localhost:3000/", "description": "Localhost API base URL"},
    ],
}
