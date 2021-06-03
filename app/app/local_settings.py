import os
import environ
from pathlib import Path
from datetime import timedelta

from .settings import *

env = environ.Env()

SECRET_KEY = env('SECRET_KEY')

DEBUG = True

ALLOWED_HOSTS = ['0.0.0.0', 'localhost']

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000"
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'HOST': os.environ['DB_HOST'],
        'PORT': 5432,
    }
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'