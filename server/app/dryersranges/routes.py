from flask import jsonify, request, session
from app.extensions import db
from app.models import MachineDryer, MachineRange, Archive, Tech, Notes
from flask_login import current_user, login_required
from app.dryersranges import bp