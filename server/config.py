from os import environ
from dotenv import load_dotenv
from datetime import timedelta
import redis

load_dotenv()

class Config:
    SECRET_KEY = environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = environ.get("DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLASK_ENV = "production"
    DEBUG = False
    
    SESSION_TYPE = "redis"
    SESSION_REDIS = redis.from_url("redis://localhost:6379")
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_PERMANENT = True
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = "blu:"
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    PREFERRED_URL_SCHEME = 'https'
    CORS_ORIGINS = ['https://blutape.net']
    CORS_SUPPORTS_CREDENTIALS = True
    
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USERNAME = "cameron@mattsappliancesla.net"
    MAIL_PASSWORD = environ.get("APP_PASSWORD")
    MAIL_USE_TLS = True
    MAIL_DEFAULT_SENDER = "cameron@mattsappliancesla.net"
    
    