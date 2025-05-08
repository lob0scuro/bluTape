from flask import request, jsonify
from app.create import bp
from flask_login import login_required, current_user
from app.models import Machine, Tech, Notes, Archive
from app.extensions import db


@bp.route("/create_repair", methods=["POST"])
@login_required
def create_repair():
    try:
        data = request.get_json()
        if not data:
            return jsonify(error="No payload in request"), 400
        brand = data.get("brand")
        model = data.get("model")
        serial = data.get("serial")
        color = data.get("color")
        style = data.get("style")
        vendor = data.get("vendor")
        condition = data.get("condition")
        machine_type = data.get("machine_type")
        note = data.get("note")
    
        newMachine = Machine(brand=brand, model=model.upper(), serial=serial.upper(), color=color, style=style, vendor=vendor, condition=condition.upper(), machine_type=machine_type)
        db.session.add(newMachine)
        db.session.commit()
        newNote = Notes(content=note, tech_id=current_user.id, machine_id=newMachine.id)
        db.session.add(newNote)
        db.session.commit()
        return jsonify(message="Machine added to database!", machine=newMachine.serialize()), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error=f"Server Error: {e}"), 500



@bp.route("/add_note", methods=["POST"])
@login_required
#Need to recieve content and machine ID
#Pull tech_id from current user
def add_note():
    try:
        data = request.get_json()
        if not data:
            print("Payload error")
            return jsonify(error="No payload in request"), 404
        content = data.get("content")
        machine_id = data.get("machine_id")
        new_note = Notes(content=content, tech_id=current_user.id, machine_id=machine_id)
        db.session.add(new_note)
        db.session.commit()
        return jsonify(message="New note added successfully!", new_note=new_note.serialize()), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error=f"Server error: {e}"), 500
        