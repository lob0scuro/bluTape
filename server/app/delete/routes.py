from flask import request, jsonify
from app.delete import bp
from app.extensions import db
from app.models import Tech, Machine, Archive, Notes
from flask_login import login_required, current_user

@bp.route("/delete/<int:id>", methods=["DELETE"])
@login_required
def delete(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            print("Machine not found in database.")
            return jsonify(error="Machine not found in database."), 404
        db.session.delete(machine)
        db.session.commit()
        return jsonify(message="Machine deleted from database."), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error=f"Server error: {e}"), 500
        