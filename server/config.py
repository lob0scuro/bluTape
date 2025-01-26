import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "matt.blutape@gmail.com"
    MAIL_PASSWORD = os.environ.get('APP_PASSWORD')
    MAIL_DEFAULT_SENDER = "matts.blutape@gmail.com"
    DEBUG = False