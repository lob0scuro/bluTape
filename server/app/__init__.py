from flask import Flask
from config import Config
from app.extensions import cors, db, login_manager, mail
from app.models import Tech

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    #initialize extensions
    db.init_app(app)
    cors.init_app(app)
    login_manager.init_app(app)
    mail.init_app(app)
    
    #register blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp)
    
    @login_manager.user_loader
    def load_user(id):
        return Tech.query.get(int(id))
    
    
    #test route
    @app.route('/test')
    def test():
        return "Hello World!"
    
    return app