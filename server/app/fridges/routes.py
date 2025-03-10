from flask import jsonify, request, session
from app.extensions import db
from app.models import Fridge, Tech, Archive, Notes
from flask_login import current_user, login_required
from app.fridges import bp

"""_summary_

This blurprint handles Refrigerator data from the application

"""


#create new machine for repair
@bp.route('/create_fridge', methods=('GET', 'POST'))
@login_required
def create_fridge():
    try:
        all_machines = Fridge.query.all()
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
        addMachine = Fridge(make=make.capitalize() if len(make) > 2 else make.upper(), model=model.upper(), serial=serial.upper(), color=color, style=style, condition=condition)
        db.session.add(addMachine)
        db.session.commit()
        
        addNote = Notes(content=note, tech_id=current_user.id, fridge_id=addMachine.id)
        db.session.add(addNote)
        db.session.commit()
        return jsonify(message = f"Successfully added machine to database", machine=addMachine.serialize()), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, please check inputs and try again."), 500


# get all machines
@bp.route('/get_fridges', methods=['GET'])
@login_required
def get_fridges():
    try:
        machines = Fridge.query.filter_by(in_progress=True).all()
        return jsonify(data = [machine.serialize() for machine in machines]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query"), 400

#get machine
@bp.route('/get_fridge/<int:id>', methods=['GET'])
def get_fridge(id):
    machine = Fridge.query.get(int(id))
    if not machine:
        machine = Archive.query.get(int(id))
        if not machine:           
            return jsonify(error = "Could not find machine, check inputs and try again."), 404
        return jsonify(machine = machine.serialize()), 200
    return jsonify(machine = machine.serialize()), 200

    

#update machine info
@bp.route('/update_fridge/<int:id>', methods=('GET', 'POST'))
@login_required
def update_fridge(id):
    try:
        data = request.get_json()
        make = data.get('make')
        model = data.get('model')
        serial = data.get('serial')
        color = data.get('color')
        style = data.get('style')
        condition = data.get('condition')
        
        machine = Fridge.query.get(id)
        machine.make = make.capitalize() if len(make) > 2 else make.upper()
        machine.model = model.upper()
        machine.serial = serial.upper()
        machine.color = color
        machine.style = style
        machine.condition = condition.upper()
        
        db.session.commit()
        return jsonify(message = "Successfully updated machine!"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, check inputs and try agian."), 401

# add note to machine
@bp.route('/add_note/<int:id>', methods=('GET', 'POST'))
@login_required
def add_note(id):
    machine = Fridge.query.get(id)
    if not machine:
        return jsonify(error = "Could not locate machine, check inputs and try again"), 400
    try:
        data = request.get_json()
        note = data.get('note')
        addNote = Notes(content=note, tech_id=current_user.id, machine_id=machine.id)
        db.session.add(addNote)
        db.session.commit()
        return jsonify(message = "Note added to machine"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error="Problem with query, please try again"), 401
    
    
# delete machine
@bp.route('/delete/<int:id>', methods=['DELETE'])
@login_required
def delete(id):
    machine = Fridge.query.get(int(id))
    if not machine:
        machine = Archive.query.get(int(id))
        if not machine:
            return jsonify(error = "Machine not found"), 401
    try:
        db.session.delete(machine)
        db.session.commit()
        return jsonify(message = "Deleted machine from database!"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Problem with query, check inputs and try again"), 401
    
    
# get inventory list
@bp.route('/get_inventory', methods=('GET', 'POST'))
@login_required
def get_inventory():
    try:
        machines = Fridge.query.filter_by(in_progress=False).all()
        return jsonify(data = [machine.serialize() for machine in machines]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query, please try again"), 400
        
    
# add machine to Inventory list
@bp.route('/add_to_inventory/<int:id>', methods=('GET', 'POST'))
@login_required
def add_to_inventory(id):
    machine = Fridge.query.get(id)
    if not machine:
        return jsonify(error = "Could not locate machine, check inputs and try again"), 400
    try:
        machine.in_progress = False
        db.session.commit()
        return jsonify(message = "Machine added to inventory"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Error with query, please try again"), 400