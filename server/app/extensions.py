from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_login import LoginManager
from flask_mail import Mail
from flask_session import Session

db = SQLAlchemy()
cors = CORS()
login_manager = LoginManager()
mail = Mail()
migrate = Migrate()
session = Session()