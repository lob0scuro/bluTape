import os
from dotenv import load_dotenv

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
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'None'
    
    PREFERRED_URL_SCHEME = 'https'
    CORS_ORIGINS = ['https://blutape.net']
    CORS_SUPPORTS_CREDENTIALS = True


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
    
    
    
    