from flask import Blueprint

bp = Blueprint("labels", __name__, url_prefix="/labels")

from app.labels import routes