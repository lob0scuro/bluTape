from flask import Blueprint

bp = Blueprint("fridges", __name__, url_prefix="/fridges")

from app.fridges import routes