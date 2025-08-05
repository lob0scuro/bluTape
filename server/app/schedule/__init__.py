from flask import Blueprint

bp = Blueprint("schedule", __name__, url_prefix="/schedule")

from app.schedule import routes