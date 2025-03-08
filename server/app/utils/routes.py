from flask import jsonify, request, session
from app.extensions import db, mail
from app.models import Tech, Notes
from flask_mail import Message
from flask_login import login_required, current_user
from app.utils import bp


"""
__summary__
This blueprint is for app utilites


"""


#get technician
@bp.route('/get_tech/<int:id>', methods=['GET'])
def get_tech(id):
    tech = Tech.query.get(id)
    if not tech:
        return jsonify(error = "Tech not found, check inputs and try again."), 401
    return jsonify(tech = tech.serialize()), 200


#get all technicians
@bp.route('/get_techs', methods=['GET'])
def get_techs():
    try:
        techs = Tech.query.all()
        return jsonify(techs = [tech.serialize() for tech in techs]), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query"), 401
    
    
    
# delete note from machine
@bp.route('/delete_note/<int:id>', methods=['DELETE'])
@login_required
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



# send exported as .xlsx sheet data to email 
@bp.route("/send_email", methods=('GET', 'POST'))
@login_required
def send_email():
    if "file" not in request.files:
        return jsonify(error = "No file uploaded"), 400
    file = request.files['file']
    
    if not file:
        return jsonify(error = "File is empty"), 400
    try:
        msg = Message(
            "Inventory Log",
            recipients=["jesse@mattsappliancesla.net", "ethann@mattsappliancesla.net", "kamrin717@gmail.com"],
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