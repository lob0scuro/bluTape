from flask import jsonify, request
from app.api import bp
from app.extensions import db, mail
from app.models import Tech, Machine, Notes, Archive
from flask_login import login_user, logout_user, current_user
from flask_mail import Message

#register new technician
@bp.route('/register', methods=('GET', 'POST'))
def register():
    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        if not all(first_name, last_name):
            return jsonify(error = "all fields required"), 400
        newTech = Tech(first_name=first_name, last_name=last_name)
        db.session.add(newTech)
        db.session.commit()
        return jsonify(message = f"Succesfully create user {newTech.first_name}"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, please check inputs and try again"), 500

#login technician
@bp.route('/login/<int:id>', methods=('GET', 'POST'))
def login(id):
    try:
        # data = request.get_json()
        # tech_id = data.get('id')
        tech = Tech.query.get(id)
        if not tech:
            return jsonify(error = "Tech not found, please check inputs and try again."), 400
        login_user(tech)
        return jsonify(message = f"Logged in as {tech.first_name}", tech = tech.serialize())
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query, check inputs and try again"), 401

#logout technician
@bp.route('/logout', methods=('GET', 'POST'))
def logout():
    logout_user()
    return jsonify(message = "Logged out.")

#create new machine for repair
@bp.route('/create_machine', methods=('GEET', 'POST'))
def create_machine():
    try:
        data = request.get_json()
        make = data.get('make')
        model = data.get('model')
        serial = data.get('serial')
        color = data.get('color')
        style = data.get('style')
        
        note = data.get('note')
        addMachine = Machine(make=make, model=model, serial=serial, color=color, style=style)
        db.session.add(addMachine)
        db.session.commit()
        
        addNote = Notes(content=note, tech_id=current_user.id, machine_id=addMachine.id)
        db.session.add(addNote)
        db.session.commit()
        return jsonify(message = f"Successfully added machine to database", machine=addMachine.serialize()), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, please check inputs and try again."), 500

#get all technicians
@bp.route('/get_techs', methods=['GET'])
def get_techs():
    try:
        techs = Tech.query.all()
        return jsonify(techs = [tech.serialize() for tech in techs]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query"), 401

#get technician
@bp.route('/get_tech/<int:id>', methods=['GET'])
def get_tech(id):
    tech = Tech.query.get(id)
    if not tech:
        return jsonify(error = "Tech not found, check inputs and try again."), 401
    return jsonify(tech = tech.serialize()), 200


# get all machines
@bp.route('/get_machines', methods=['GET'])
def get_machines():
    try:
        machines = Machine.query.filter_by(in_progress=True).all()
        return jsonify(data = [machine.serialize() for machine in machines]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query"), 400

#get machine
@bp.route('/get_machine/<int:id>', methods=['GET']) 
def get_machine(id):
    machine = Machine.query.get(int(id))
    if not machine:
        return jsonify(error = "Could not find machine, check inputs and try again."), 404
    return jsonify(machine = machine.serialize()), 200

#update machine info
@bp.route('/update_machine/<int:id>', methods=('GET', 'POST'))
def update_macine(id):
    try:
        data = request.get_json()
        make = data.get('make')
        model = data.get('model')
        serial = data.get('serial')
        color = data.get('color')
        style = data.get('style')
        
        machine = Machine.query.get(id)
        machine.make = make
        machine.model = model
        machine.serial = serial
        machine.color = color
        machine.style = style
        
        db.session.commit()
        return jsonify(message = "Successfully updated machine!"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, check inputs and try agian."), 401

# add note to machine
@bp.route('/add_note/<int:id>', methods=('GET', 'POST'))
def add_note(id):
    machine = Machine.query.get(id)
    if not machine:
        return jsonify(error = "Could not locate machine, check inputs and try again"), 400
    try:
        data = request.get_json()
        note = data.get('note')
        addNote = Notes(content=note, tech_id=current_user.id, machine_id=machine.id)
        db.session.add(addNote)
        db.session.commit()
        return jsonify(message = "Success! note added to machine"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error="Problem with query, please try again"), 401

# delete note from machine
@bp.route('/delete_note/<int:id>', methods=['DELETE'])
def delete_note(id):
    note = Notes.query.get(id)
    if not note:
        return jsonify(error = "Could not find note, check inputs and try again"), 400
    try:
        db.session.delete(note)
        db.session.commit()
        return jsonify(message = "Deleted Note"), 200
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, please try again"), 401
        
# delete machine
@bp.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    machine = Machine.query.get(id)
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
def get_inventory():
    try:
        machines = Machine.query.filter_by(in_progress=False).all()
        return jsonify(machines = [machine.serialize() for machine in machines]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query, please try again"), 400
        
    
# add machine to Inventory list
@bp.route('/add_to_inventory/<int:id>', methods=('GET', 'POST'))
def add_to_inventory(id):
    machine = Machine.query.get(id)
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
    
# add machine to archive list and delete from active table
@bp.route('/archive_machines', methods=('GET', 'POST'))
def archive_machines():
    try:
        data = request.get_json()
        if not data:
            return jsonify("Data not received"), 401
        for d in data:
            machine = Machine.query.get(int(d["id"]))
            archive_item = Archive(id = machine.id, make=machine.make, model=machine.model, serial=machine.serial, color=machine.color, style=machine.style, notes=machine.notes)
            db.session.add(archive_item)
            db.session.flush()
            Notes.query.filter_by(machine_id=machine.id).update({'machine_id': None, 'archive_id': archive_item.id})
            db.session.delete(machine)
            db.session.commit()       
        return jsonify(message="Added machines to archive!")
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Problem with query, please try again"), 400
    
    
@bp.route('/get_archives', methods=('GET', 'POST'))
def get_archives():
    try:
        machines = Archive.query.all()
        if not machines:
            return jsonify(error="Could not fetch archives, please try again"), 401
        return jsonify([machine.serialize() for machine in machines]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Problem with query, please try again"), 401
    
@bp.route("/get_archived_machine/<int:id>", methods=('GET', 'POST'))    
def get_archived_machine(id):
    try:
        machine = Archive.query.get(id)
        if not machine:
            return jsonify(error=f"Could not fin machine with id {id}"), 400
        return jsonify(machine.serialize()), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error="Problem with query, please check inputs and try again"), 401
        
    

    
        
# send exported as .xlsx sheet data to email 
@bp.route("/send_email", methods=('GET', 'POST'))
def send_email():
    if "file" not in request.files:
        return jsonify(error = "No file uploaded"), 400
    file = request.files['file']
    
    if not file:
        return jsonify(error = "File is empty"), 400
    
    try:
        msg = Message(
            "Inventory Log",
            recipients=["kamrin717@gmail.com"],
            body="Please find attached the inventory log"
        )
        
        msg.attach(
            filename=file.filename,
            content_type=file.mimetype,
            data=file.read(),
        )
        
        mail.send(msg)
        
        return jsonify(message = "Email sent successfully")
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Failed to send message")
    