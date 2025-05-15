import os
from flask import jsonify, request, session, current_app
from werkzeug.utils import secure_filename
from app.auth import bp
from app.models import Tech
from app.extensions import db, bcrypt
from flask_login import login_user, logout_user, login_required, current_user

"""
_SUMMARY_

Auth blueprint for registering, logging in and logging out users, need to handle updating  technician information

"""

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['UPLOAD_EXTENSIONS']

#REGISTER NEW TECHNICIANS
@bp.route("/register", methods=['POST'])
def register():
    try:
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        email = request.form.get("email")
        role = request.form.get("role")
        is_admin = request.form.get("is_admin", "false").lower() == "true"
        password = request.form.get("password")
        password2 = request.form.get("password2")
        file = request.files.get("profile_pic")
        
        if password != password2:
            return jsonify(error="Passwords do not match, please check inputs and try again."), 409
        
        filename = None
        if file and '.' in file.filename:
            ext = file.filename.rsplit('.', 1)[1].lower()
            if ext not in current_app.config['UPLOAD_EXTENSIONS']:
                return jsonify(error="Invalid file type."), 400
            secure_name = secure_filename(file.filename)
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], secure_name)
            file.save(file_path)
            filename = secure_name
            
        new_tech = Tech(first_name=first_name.capitalize(), last_name=last_name.capitalize(), email=email, is_admin=is_admin, role=role, password=bcrypt.generate_password_hash(password).decode("utf-8"), profile_pic = f"{current_app.config['UPLOAD_URL']}/{filename}" if filename else f"{current_app.config['UPLOAD_URL']}/profile_default.png")
        
        db.session.add(new_tech)
        db.session.commit()
        return jsonify(message="New tech added successfully!"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error=f"Server error: {e}"), 500
    
# LOGIN TECHNICIAN
@bp.route("/login", methods=['POST'])
def login():
    try:
        data = request.get_json()
        tech_id = data.get("tech_id")
        password = data.get("password")
        
        if not tech_id or not password:
            return jsonify(error="all fields are required"), 400
        
        tech = Tech.query.get(tech_id)
        if not tech:
            return jsonify(error="user not found"), 404
        
        if not bcrypt.check_password_hash(tech.password, password):
            return jsonify(error="Invalid credentials, please try again"), 401
        
        login_user(tech)
        return jsonify(message=f"Logged in as {tech.first_name}", tech=tech.serialize()), 200
    except Exception as e:
        print(f"There was an error: {e}")
        return jsonify(error=f"Server error: {e}"), 500
    
#FORGOT PASSWORD
@bp.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify(error="No payload in request"), 404
    email = data.get("email")
    
    if not email:
        return jsonify(error="field missing in payload"), 404
    user = Tech.query.filter(email=email).first()
    if not user:
        return jsonify(error="Not a valid email, please try again"), 404
    
    #NEED TO FINISH THIS ROUTE
    return 
    
#LOGOUT TECHNICIAN
@bp.route("/logout", methods=["GET"])
def logout():
    try:
        logout_user()
        return jsonify(message="Logged out."), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(f"Server error: {e}"), 500
    
    
@bp.route("/get_user", methods=['GET'])
@login_required
def get_user():
    return jsonify(user=current_user.serialize())
        

#GET ALL TECHNICIANS
@bp.route("/get_all_techs", methods=["GET"])
def get_all_techs():
    try:
        techs = Tech.query.all()
        if not techs:
            return jsonify(error="There was a problem with the query, please try again."), 404
        return jsonify([tech.serialize() for tech in techs]), 200
    except Exception as e:
        print(f"There was an error: {e}")
        return jsonify(error=f"There was a server error: {e}"), 500
    
#GET ONE TECH
@bp.route("/get_one_tech/<int:id>", methods=["GET"])
def get_one_tech(id):
    try:
        tech = Tech.query.get(id)
        if not tech:
            return jsonify("Tech not found, please check inputs and try again."), 404
        return jsonify(tech.serialize()), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error=f"Server error: {e}"), 500

#UPDATE TECHNICIAN INFO (TBD)
#STILL NEED TO FINISH THIS ROUTE
@bp.route("/update_tech/<int:id>", methods=["PATCH"])
def update_tech(id):
    try:
        data = request.form  # use `request.form` for handling form data (files)
        file = request.files.get("profile_pic")  # handle file upload if any
        
        # Fetch the tech record
        tech = Tech.query.get(id)
        if not tech:
            return jsonify(error="Could not find tech."), 404

        # Fields to update
        fieldList = ["first_name", "last_name", "email"]
        updated = False

        # Update fields
        for field in fieldList:
            if field in data:
                setattr(tech, field, data[field])
                updated = True

        # If a file (image) is uploaded, handle it
        if file:
            # Validate file extension (as done in registration)
            if '.' in file.filename:
                ext = file.filename.rsplit('.', 1)[1].lower()
                if ext not in current_app.config['UPLOAD_EXTENSIONS']:
                    return jsonify(error="Invalid file type."), 400
                
                # Save the new file
                secure_name = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], secure_name)
                file.save(file_path)
                
                # Update the profile_pic field in the database
                tech.profile_pic = f"{current_app.config['UPLOAD_URL']}/{secure_name}"
                updated = True

        # Commit the changes if there were any
        if updated:
            db.session.commit()
            return jsonify(message=f"Successfully updated {tech.first_name}", tech=tech.serialize()), 200
        else:
            return jsonify(message="No changes were made."), 200

    except Exception as e:
        print(f"Server error during update tech: {e}")
        return jsonify(error=f"Server error: {e}"), 500
