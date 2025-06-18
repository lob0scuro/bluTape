from flask import Blueprint

bp = Blueprint("read", __name__, url_prefix="/read")

from app.read import routes