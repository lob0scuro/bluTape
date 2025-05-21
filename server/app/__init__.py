from flask import Flask, send_from_directory
from config import Config, TestConfig
from app.extensions import cors, db, login_manager, mail, migrate, session, bcrypt
from app.models import Tech

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='static')
    app.config.from_object(config_class)
    #initialize extensions
    db.init_app(app)
    cors.init_app(app, supports_credentials=True, origins=['https://blutape.net'])
    login_manager.init_app(app)
    session.init_app(app)
    mail.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    
    
    #register blueprints
    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)
    from app.create import bp as create_bp
    app.register_blueprint(create_bp)
    from app.read import bp as read_bp
    app.register_blueprint(read_bp)
    from app.update import bp as update_bp
    app.register_blueprint(update_bp)
    from app.delete import bp as delete_bp
    app.register_blueprint(delete_bp)
    
    @login_manager.user_loader
    def load_user(id):
        return Tech.query.get(int(id))
    
    
    @app.route('/images/<filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    return app