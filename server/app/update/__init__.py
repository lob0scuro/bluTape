from flask import Blueprint

bp = Blueprint("update", __name__, url_prefix="/update")

from app.update import routes