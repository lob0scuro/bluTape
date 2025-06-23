from flask import jsonify, request
from app.update import bp
from app.extensions import db
from app.models import User, Machine, Task
from datetime import date
from flask_login import current_user, login_required

@bp.route("/update_user/<int:id>", methods=['PATCH'])
@login_required
def update_user(id):
    try:
        data = request.get_json()
        user = User.query.get(id)
        if not user:
            return jsonify(error="Could not find user."), 400
        fieldList = ["first_name", "last_name", "email", "position"]
        updated = False
        
        for field in fieldList:
            if field in data:
                setattr(user, field, data[field])
                updated = True
                
        if updated:
            db.session.commit()
            return jsonify(message=f"{user.first_name} info has been updated!"), 200
        else:
            return jsonify(message="no changes were made"), 200
    except Exception as e:
        print(f"Error when updating user: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when updating user: {e}"), 500
    
@bp.route("/update_machine/<int:id>", methods=['PATCH'])
@login_required
def update_machine(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify("Could not find machine."), 400
        data = request.get_json()
        if not data:
            return jsonify(error="No payload in request."), 400
        fields = ["brand", "model", "serial", "style", "color", "condition", "vendor"]
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
            return jsonify(message="Machine updated!"), 200
        else:
            return jsonify(message="No changes were made."), 200
    except Exception as e:
        print(f"Error when updating machine: {e}")
        db.session.rollback()
        return jsonify(f"Error when updating machine: {e}"), 500

#MACHINE GETS MOVED FROM QUEUE TO AWAITING EXPORT
@bp.route("/update_cleaned_status/<int:id>", methods=['PATCH'])
@login_required
def update_cleaned_status(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            print("Could not find machine.")
            return jsonify(error="Could not find machine."), 400
        machine.is_clean = not machine.is_clean
        machine.cleaned_on = date.today() if machine.is_clean else None
        machine.cleaned_by = current_user.id if machine.is_clean else None
        db.session.commit()
        return jsonify(message="Machine clean status has been successfully updated!"), 200
    except Exception as e:
        print(f"Error when updating cleaned status on machine: {e}")
        return jsonify(eror=f"Error when updating cleaned status on machine: {e}"), 500
    
#MACHINE GETS EXPORTED
@bp.route("/update_export_status/<int:id>", methods=["PATCH"])
@login_required
def change_exported_status(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            print("Could not find machine.")
            return jsonify(error="Could not find machine."), 400
        machine.is_exported = not machine.is_exported
        db.session.commit()
        return jsonify(message="Machine export status updated successfully!"), 200
    except Exception as e:
        print(f"Error when exporting machine: {e}")
        return jsonify(error=f"Error when exporting machine: {e}"), 500
    
#MANY MACHINES GET EXPORTED
@bp.route("/export_many_machines", methods=["PATCH"])
@login_required
def export_machines():
    try:
        data = request.get_json()
        if not data:
            return jsonify(error="No payload in request"), 400
        machines = data.get("machines", [])
        machines_to_export = Machine.query.filter(Machine.id.in_(machines)).all()
        if not machines_to_export:
            return jsonify(error="No machines to export"), 400
        for machine in machines_to_export:
            machine.is_exported = True
        db.session.commit()
        return jsonify(message="Machines have been exported"), 200
    except Exception as e:
        print(f"Error when exporting machines: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when exporting machines: {e}"), 500
    

@bp.route("/change_task_status/<int:id>", methods=['PATCH'])
@login_required
def change_task_status(id):
    try:
        task = Task.query.get(id)
        if not task:
            return jsonify(error="Could not find task."), 400
        task.is_complete = not task.is_complete
        db.session.commit()
        return jsonify(message="Task has been updated."), 200
    except Exception as e:
        print(f"Error when deleting task: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when deleting task: {e}"), 500