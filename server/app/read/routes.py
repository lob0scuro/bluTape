from flask import request, jsonify
from app.read import bp
from app.extensions import db
from app.models import Machine, Notes, Archive
from flask_login import current_user, login_required

tableMap = {
    0: Machine,
    1: Archive
}

@bp.route("/get_all_machines/<int:table>/<int:status>", methods=["GET"])
@login_required
def get_active_repairs(table, status):
    try:
        model = tableMap.get(table)
        if not model:
            return jsonify("Invalid table ID"), 400
        status = int(status)
        machines = model.query.filter(model.in_progress == (status == 0)).all()
        if not machines:
            return jsonify(error="Could not query database, please try again."), 404
        return jsonify([machine.serialize() for machine in machines]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error=f"Server error: {e}"), 500
    
    
@bp.route("/get_one_machine/<int:table>/<int:id>", methods=["GET"])
@login_required
def get_one_machine(table, id):
    try:
        model = tableMap.get(table)
        if not model:
            return jsonify(error="Invalid table ID"), 400
        machine = model.query.get(id)
        if not machine:
            return jsonify(error="Could not find machine in database, please try again"), 404
        return jsonify(machine.serialize()), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(f"Server Error: {e}"), 500