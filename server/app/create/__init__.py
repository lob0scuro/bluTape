from flask import Blueprint

bp = Blueprint("create", __name__, url_prefix="/create")

from app.create import routes