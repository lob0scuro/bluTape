from flask import Blueprint

bp = Blueprint('exports', __name__, url_prefix='/exports')

from app.exports import routes