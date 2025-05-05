import os
from dotenv import load_dotenv
from datetime import timedelta
import redis

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = "matts.blutape@gmail.com"
    MAIL_PASSWORD = os.environ.get('APP_PASSWORD')
    MAIL_DEFAULT_SENDER = "matts.blutape@gmail.com"
    DEBUG = False
    SESSION_TYPE = 'redis'
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = "blutape:"
    SESSION_REDIS = redis.from_url("redis://localhost:6379")
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    
    PREFERRED_URL_SCHEME = 'https'
    CORS_ORIGINS = ['https://blutape.net']
    CORS_SUPPORTS_CREDENTIALS = True
    UPLOAD_EXTENSIONS = ['jpg', 'png', 'jpeg']
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'app', 'static', 'images')
    UPLOAD_URL = "/static/images"


class TestConfig:
    SECRET_KEY = "dev"
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = "matts.blutape@gmail.com"
    MAIL_PASSWORD = os.environ.get('APP_PASSWORD')
    MAIL_DEFAULT_SENDER = "matts.blutape@gmail.com"
    DEBUG = True
    UPLOAD_EXTENSIONS = ['jpg', 'png', 'jpeg']
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'app', 'static', 'images')
    UPLOAD_URL = "/static/images"
    SESSION_COOKIE_SECURE = False
    
    
    
    