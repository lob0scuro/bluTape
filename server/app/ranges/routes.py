from flask import jsonify, request, session
from app.ranges import bp
from app.extensions import db
from app.models import Range, Tech, Notes, Archive
from flask_login import current_user