from flask import jsonify, request, current_app
from app.delete import bp
from app.extensions import db
from app.models import Machine, Note, Task, User
from flask_login import current_user

@bp.route("/delete_user/<int:id>", methods=['POST'])
def delete_user(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify(error="Could not find user."), 400
        db.session.delete(user)
        db.session.commit()
        return jsonify(message="User has been deleted from database."), 200
    except Exception as e:
        print(f"Error when deleting user: {e}")
        db.session.rollback()
        return jsonify(f"Error when deleting user: {e}"), 500

@bp.route("/delete_machine/<int:id>", methods=['DELETE'])
def delete_machine(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify(error="Could not find machine."), 400
        db.session.delete(machine)
        db.session.commit()
        current_app.logger.info(f"{current_user.first_name} {current_user.last_name} deleted a {machine.machine_type} from the database")
        return jsonify(message="Machine has been deleted from database."), 200
    except Exception as e:
        print(f"Error when deleting machine: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when deleting machine: {e}"), 500
    
@bp.route("/delete_note/<int:id>", methods=['DELETE'])
def delete_note(id):
    try:
        note = Note.query.get(id)
        if not note:
            return jsonify(error="Could not find note."), 400
        db.session.delete(note)
        db.session.commit()
        return jsonify(message="Note has been deleted."), 200
    except Exception as e:
        print(f"Error when deleting note: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when deleting note: {e}"), 500
    
    
@bp.route("/delete_task/<int:id>", methods=['DELETE'])
def delete_task(id):
    try:
        task = Task.query.get(id)
        if not task:
            return jsonify(error="Could not find task."), 400
        db.session.delete(task)
        db.session.commit()
        return jsonify(message="Task has been deleted."), 200
    except Exception as e:
        print(f"Error when deleting task: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when deleting task: {e}"), 500
    
