from flask import Blueprint

bp = Blueprint("washers", __name__, url_prefix="/washers")

from app.washers import routes