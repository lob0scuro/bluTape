from flask import Blueprint

bp = Blueprint('export', __name__, url_prefix='/export')

from app.exports import routes