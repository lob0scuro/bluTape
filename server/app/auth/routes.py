from flask import jsonify, request, session
from app.extensions import db
from app.models import Tech
from flask_login import login_user, logout_user, login_required, current_user
from app.auth import bp


"""
__summary__
This blueprint is for handling authorization for application

"""

#register technicians
@bp.route('/register', methods=('GET', 'POST'))
def register():
    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        role = data.get("role")
        is_admin = data.get("is_admin")
        
        newTech = Tech(first_name=first_name.capitalize(), last_name=last_name.capitalize(), role=int(role), is_admin=is_admin)
        db.session.add(newTech)
        db.session.commit()
        return jsonify(message = f"Succesfully create user {newTech.first_name}"), 201
    except Exception as e:
        print(f"Error: {e}")
        db.session.rollback()
        return jsonify(error = "Could not complete query, please check inputs and try again"), 500
    
    
#login technicians
@bp.route('/login/<int:id>', methods=('GET', 'POST'))
def login(id):
    try:
        tech = Tech.query.get(id)
        if not tech:
            return jsonify(error = "Tech not found, please check inputs and try again."), 400
        login_user(tech)
        session['ip_address'] = request.remote_addr
        session['user_agent'] = request.user_agent.string
        session['first_name'] = tech.first_name
        session['last_name'] = tech.last_name
        session['uid'] = tech.id
        session['is_admin'] = tech.is_admin
        return jsonify(message = f"Logged in as {tech.first_name}", tech = {"first_name": tech.first_name, "last_name": tech.last_name, "id": tech.id, "is_admin": tech.is_admin, "role": tech.role})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error = "Problem with query, check inputs and try again"), 401
    
    

#logout technician
@bp.route('/logout', methods=('GET', 'POST'))
def logout():
    logout_user()
    session.clear()
    return jsonify(message = "Logged out.")


# checks current user session
@bp.route("/check_session", methods=['GET'])
@login_required
def check_session():
    return jsonify({"id": current_user.id, "first_name": current_user.first_name, "last_name": current_user.last_name, "is_admin": current_user.is_admin, "role": current_user.role})