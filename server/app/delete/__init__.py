from flask import Blueprint

bp = Blueprint("delete", __name__, url_prefix="/delete")

from app.delete import routes