from flask import jsonify, request, session
from app.extensions import db, login_manager
from app.models import Tech
from flask_login import login_user, logout_user, login_required, current_user
from app.auth import bp