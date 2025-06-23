from flask import Flask
from config import Config
from .extensions import db, migrate, bcrypt, cors, login_manager, session, mail
from .models import User
from itsdangerous import URLSafeTimedSerializer

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    #EXTENSIONS
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app)
    login_manager.init_app(app) 
    session.init_app(app) 
    mail.init_app(app)
    
    from . import extensions
    extensions.serializer = URLSafeTimedSerializer(app.secret_key)
    
    
      
    
    #BLUEPRINTS
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)
    from app.create import bp as create_bp
    app.register_blueprint(create_bp)
    from app.delete import bp as delete_bp
    app.register_blueprint(delete_bp)
    from app.read import bp as read_bp
    app.register_blueprint(read_bp)
    from app.update import bp as update_bp
    app.register_blueprint(update_bp)
    
    #USERMIXIN
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(id)
    
    return app