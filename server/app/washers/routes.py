from flask import jsonify, request, session
from app.extensions import db
from app.models import Washer, Tech, Archive, Notes
from flask_login import current_user, login_required
from app.washers import bp