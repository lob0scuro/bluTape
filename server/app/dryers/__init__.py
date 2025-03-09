from flask import Blueprint

bp = Blueprint("dryersandranges", __name__, url_prefix="/dryersandranges")

from app.dryers import routes