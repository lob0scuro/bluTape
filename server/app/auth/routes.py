from flask import jsonify, request, session
from app.auth import bp
from app.models import Tech
from app.extensions import db, bcrypt
from flask_login import login_user, logout_user, login_required

"""
_SUMMARY_

Auth blueprint for registering, logging in and logging out users, need to handle updating  technician information

"""

#REGISTER NEW TECHNICIANS
@bp.route("/register", methods=['POST'])
def register():
    try:
        data = request.get_json()
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        role = data.get("role")
        is_admin = data.get("is_admin")
        password = data.get("password")
        password2 = data.get("password2")
        
        if password != password2:
            return jsonify(error="Passwords do not match, please check inputs and try again."), 409
        
        
        new_tech = Tech(first_name=first_name.capitalize(), last_name=last_name.capitalize(), is_admin=is_admin, role=role, password=bcrypt.generate_password_hash(password).decode("utf-8"))
        
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
        
        if not tech_id and not password:
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
    
#LOGOUT TECHNICIAN
@bp.route("/logout", methods=["GET"])
@login_required
def logout():
    try:
        logout_user()
        return jsonify(message="Logged out."), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(f"Server error: {e}"), 500
        

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
@bp.route("/update_tech/<int:id>/<field>", methods=["PUT"])
def update_tech(id, feild):
    try:
        tech = Tech.query.get(id)
        if not tech:
            return jsonify("Could not find tech."), 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(f"Server error: {e}"), 500