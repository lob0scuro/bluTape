from flask import Blueprint

bp = Blueprint("refrigerators", __name__, url_prefix="/refrigerators")

from app.fridges import routes