from flask import jsonify, request, session
from app.extensions import db, mail
from flask_mail import Message
from flask_login import login_required, current_user
from app.utils import bp