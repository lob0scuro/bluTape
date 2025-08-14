from flask import jsonify, request, current_app
from app.create import bp
from app.extensions import db
from flask_login import current_user
from app.models import Machine, Note, Task
from sqlalchemy.exc import IntegrityError

@bp.route("/add_machine", methods=["POST"])
def add_machine():
    try:
        data = request.get_json()
        if not data:
            return jsonify(error="No data in payload."), 400
        brand = data.get("brand")
        model = data.get("model")
        serial = data.get("serial")
        style = data.get("style")
        color = data.get("color")
        condition = data.get("condition")
        vendor = data.get("vendor")
        type_id = data.get("type_id")
        note = data.get("note")
        
        exists = db.session.query(Machine).filter_by(serial=serial).first()
        if exists:
            return jsonify(error="Duplicate entry detected: a machine with this serial already exists."), 409
        
        new_machine = Machine(brand=brand, model=model.upper(), serial=serial.upper(), style=style, color=color, condition=condition, vendor=vendor, repaired_by=current_user.id, type_id=type_id)
        db.session.add(new_machine)
        db.session.commit()
        
        new_note = Note(content=note, user_id=current_user.id, machine_id=new_machine.id)
        db.session.add(new_note)
        db.session.commit()
        
        current_app.logger.info(f"{current_user.first_name} {current_user.last_name} finished repairing a {new_machine.machine_type.name}, Model:Serial // {new_machine.model}:{new_machine.serial}")
        
        return jsonify(message="Successfully added machine to database!", machine=new_machine.serialize()), 201
    except Exception as e:
        print(f"Error when inputting machine: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when adding new machine to database: {e}"), 500
    
@bp.route("/add_note/<int:id>", methods=["POST"])
def add_note(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify(error="Could not associate machine for note."), 400
        data = request.get_json()
        if not data:
            return jsonify(error="No data in payload."), 400
        content = data.get("content")
        new_note = Note(content=content, user_id=current_user.id, machine_id=machine.id)
        db.session.add(new_note)
        db.session.commit()
        return jsonify(message="Added note!", note=new_note.serialize()), 201
    except Exception as e:
        print(f"Error when adding note: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when adding note: {e}"), 500
    

@bp.route("/create_task", methods=["POST"])
def create_task():
    try:
        data = request.get_json()
        if not data:
            return jsonify(error="No data in payload"), 400
        content = data.get("content")
        new_task = Task(content=content, user_id=current_user.id)
        db.session.add(new_task)
        db.session.commit()
        return jsonify(message="Task added to queue.", task=new_task.serialize()), 201
    except Exception as e:
        print(f"Error when creating new task: {e}")
        db.session.rollback()
        return jsonify(error=f"Error when creating new task: {e}"), 500
    
        