from flask import jsonify, request, Blueprint, current_app
from app.extensions import db
from flask_login import current_user
from app.models import Machine, Note

delete_bp = Blueprint("delete", __name__)

@delete_bp.route("/delete_machine/<int:id>", methods=["DELETE"])
def delete_machine(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify(success=False, message="Machine not found."), 400
        db.session.delete(machine)
        db.session.commit()
        current_app.logger.info(f"Machine with id {machine.id} has been deleted from the database.")
        return jsonify(success=True, message="Machine has been deleted from the database."), 200
    except Exception as e:
        current_app.logger.error(f"Error when deleting machine from database: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"Error when deleting machine: {e}"), 500
    
@delete_bp.route("/delete_note/<int:id>", methods=["DELETE"])
def delete_note(id):
    try:
        note = Note.query.get(id)
        if not note:
            return jsonify(success=False, message="Note not found."), 400
        db.session.delete(note)
        db.session.commit()
        current_app.logger.info(f"Note with id {note.id} has been deleted from the database.")
        return jsonify(success=True, message="Note has been deleted."), 200
    except Exception as e:
        current_app.logger.error(f"Error when deleting note from database: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"Error when deleting note: {e}"), 500