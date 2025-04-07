from flask import jsonify, request
from app.update import bp
from app.models import Machine, Tech, Notes, Archive
from flask_login import current_user, login_required
from app.extensions import db

@bp.route("/add_to_inventory/<int:id>", methods=["PATCH"])    
@login_required
def add_to_inventory(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            print("Could not find machine")
            return jsonify(error="Machine not found, please try again."), 404
        machine.in_progress = False
        db.session.commit()
        return jsonify(message="Machine status updated!"), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error=f"Server error: {e}"), 500
    
@bp.route("/edit/<int:id>", methods=['GET', 'PATCH'])
@login_required
def edit(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify(error="Machine not found."), 404
        data = request.get_json()
        if not data:
            return jsonify(error="No payload in request."), 404
        fields = ["brand", "model", "serial", "color", "style", "condition", "heat_type"]
        updated = False
        for field in fields:
            if field in data:
                setattr(machine, field, data[field])
                updated=True
        if updated:
            db.session.commit()
            return jsonify(message="Successfully updated machine!"), 200
        else:
            return jsonify(message="No changes were made."), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(f"Server error: {e}"), 500