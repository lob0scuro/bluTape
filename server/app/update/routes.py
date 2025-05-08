from flask import jsonify, request
from app.update import bp
from app.models import Machine, Tech, Notes, Archive
from flask_login import current_user, login_required
from app.extensions import db

@bp.route("/finish_repair/<int:id>", methods=["PATCH"])    
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
    

@bp.route("/inventory_one/<int:id>", methods=["PATCH"])
@login_required
def inventory_one(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            print("Could not find machine")
            return jsonify(error="Machine not found, please try again."), 404
        machine.in_progress = False
        machine.in_inventory = True
        db.session.commit()
        return jsonify(message="Machine added to inventory!"), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error=f"Server error: {e}"), 500
    
@bp.route("/inventory_many", methods=["PATCH"])
@login_required
def inventory_many():
    data = request.get_json()
    if not data:
        print("No data in payload")
        return jsonify("No data in payload"), 400
    try:
        ids_to_inventory = data.get("ids", [])
        if not ids_to_inventory:
            return jsonify(error="No data in payload"), 400
        machines_to_inventory = Machine.query.filter(Machine.id.in_(ids_to_inventory)).all()
        if not machines_to_inventory:
            return jsonify(error="No machines found"), 404
        for machine in machines_to_inventory:
            machine.in_inventory = True
            
        db.session.commit()
        return jsonify(message="Machines have been exported"), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error when handling finished repairs deletetion: {e}")
        return jsonify(f"Server Error: {e}"), 500
    
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
        fields = ["brand", "model", "serial", "color", "style", "vendor", "condition"]
        updated = False
        for field in fields:
            if field in data:
                incoming_value = data[field].strip() if isinstance(data[field], str) else data[field]
                current_value = getattr(machine, field)
                if incoming_value != current_value:
                    setattr(machine, field, incoming_value)
                    updated = True
        if updated:
            db.session.commit()
            return jsonify(message="Successfully updated machine!"), 200
        else:
            return jsonify(message="No changes were made."), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = f"Server error: {e}"), 500