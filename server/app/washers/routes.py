from flask import jsonify, request, session
from app.extensions import db
from app.models import Washer, Tech, Archive, Notes
from flask_login import current_user, login_required
from app.washers import bp

@bp.route("/create_washer", methods=['POST'])
@login_required
def create_washer():
    try:
        all_machines = Washer.query.all()
        data = request.get_json()
        make = data.get('make')
        model = data.get('model')
        serial = data.get('serial')
        color = data.get('color')
        style = data.get('type')
        condition = data.get('condition')
        
        for machine in all_machines:
            if serial.upper() in machine.serial.upper():
                return jsonify(error="Serial already exists in database."), 409
            
        note = data.get('note')
        addMachine = Washer(make=make.capitalize() if len(make) > 2 else make.upper(), model=model.upper(), serial=serial.upper(), color=color, style=style, condition=condition)
        db.session.add(addMachine)
        db.session.commit()
        
        addNote = Notes(content=note, tech_id=current_user.id, washer_id=addMachine.id)
        db.session.add(addNote)
        db.session.commit()
        return jsonify(message = f"Successfully added machine to database", machine=addMachine.serialize()), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, please check inputs and try again."), 500
    