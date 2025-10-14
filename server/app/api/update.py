from flask import jsonify, request, Blueprint, current_app
from app.extensions import db
from flask_login import current_user
from app.models import Machine, User
from datetime import datetime, timezone

update_bp = Blueprint("update", __name__)

# Hardcoded valid values
VALID_CONDITIONS = ["NEW", "USED", "Scratch and Dent"]
VALID_VENDORS = ["pasadena", "baton_rouge", "alexandria", "stines_lc", "stines_jn", "scrappers", "unknown"]
VALID_STATUS = ["in_progress", "completed", "trashed", "exported"]


@update_bp.route("/update_user/<int:id>", methods=['PATCH'])
def update_user(id):
    try:
        data = request.get_json()
        user = User.query.get(id)
        if not user:
            return jsonify(success=False, message="Could not find user."), 400
        fieldList = ["first_name", "last_name", "email", "role"]
        updated = False
        
        for field in fieldList:
            if field in data:
                setattr(user, field, data[field])
                updated = True
                
        if updated:
            db.session.commit()
            return jsonify(success=True, message=f"{user.first_name} info has been updated!", user=user.serialize()), 200
        else:
            return jsonify(success=True, message="no changes were made"), 200
    except Exception as e:
        print(f"Error when updating user: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"Error when updating user: {e}"), 500
    

@update_bp.route("/update_machine/<int:id>", methods=['PATCH'])
def update_machine(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify(success=False, message="Could not find machine."), 400

        data = request.get_json()
        if not data:
            return jsonify(success=False, message="No payload in request."), 400

        updated = False

        # Fields to update
        fields = ["brand", "model", "serial", "style", "color", "condition", "vendor", "status"]

        for field in fields:
            if field in data:
                incoming_value = data[field].strip() if isinstance(data[field], str) else data[field]
                current_value = getattr(machine, field)

                # Validate lists instead of Enums
                if field == "condition" and incoming_value not in VALID_CONDITIONS:
                    return jsonify(success=False, message="Invalid condition value."), 400
                if field == "vendor" and incoming_value not in VALID_VENDORS:
                    return jsonify(success=False, message="Invalid vendor value."), 400
                if field == "status" and incoming_value not in VALID_STATUS:
                    return jsonify(success=False, message="Invalid status value."), 400

                if incoming_value != current_value:
                    setattr(machine, field, incoming_value)
                    updated = True

                    # Automatically set timestamps for status changes
                    if field == "status":
                        now_utc = datetime.now(timezone.utc)
                        if incoming_value == "completed" and not machine.completed_on:
                            machine.completed_on = now_utc
                        elif incoming_value == "in_progress" and not machine.started_on:
                            machine.started_on = now_utc
                        elif incoming_value == "trashed" and not machine.completed_on:
                            machine.completed_on = now_utc

        if updated:
            db.session.commit()
            current_app.logger.info(f"{current_user.first_name} {current_user.last_name} updated machine id {machine.id}")
            return jsonify(success=True, message="Machine updated!", machine=machine.serialize()), 200
        else:
            return jsonify(success=True, message="No changes were made."), 200

    except Exception as e:
        current_app.logger.error(f"Error when updating machine: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"Error when updating machine: {e}"), 500