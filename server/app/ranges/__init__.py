from flask import Blueprint

bp = Blueprint("ranges", __name__, url_prefix="/ranges")

from app.ranges import routes