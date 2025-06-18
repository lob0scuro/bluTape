from flask import jsonify, request
from app.auth import bp
from app.extensions import db, bcrypt
from app.models import User
from flask_login import login_user, logout_user, current_user


@bp.route("/register", methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify(error="No payload in request."), 400
        
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        position = data.get("position")
        is_admin = data.get("is_admin")
        email = data.get("email")
        password = data.get("password")
        password2 = data.get("password2")
        
        if password != password2:
            return jsonify(error="Passwords do not match, please check inputs and try again."), 403
        
        new_user = User(first_name=first_name.capitalize(), last_name=last_name.capitalize(), position=position.capitalize(), is_admin=is_admin, email=email, password=bcrypt.generate_password_hash(password).decode("utf-8"))
        
        db.session.add(new_user)
        db.session.commit()
        return jsonify(message=f"{new_user.first_name} has been successfully registered!"), 201
    except Exception as e:
        print(f"Registration Error: {e}")
        db.session.rollback()
        return jsonify(error=f"Registration Error: {e}"), 500
    
    
@bp.route("/login/<int:id>", methods=["POST"])
def login(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify("User not found, please check inputs and try again."), 400
        data = request.get_json()   
        password = data.get("password")
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify(error="Invalid credentials, please check inputs and try again."), 401
        login_user(user)
        return jsonify(message=f"Logged in as {user.first_name}", user=user.serialize())
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify(error=f"Login error: {e}"), 500
    

@bp.route("/logout", methods=['GET'])
def logout():
    try:
        logout_user()
        return jsonify(message="Logged out."), 200
    except Exception as e:
        print(f"Logout Error: {e}")
        return jsonify(error=f"Error when logging out: {e}"), 500
    


@bp.route("/refresh_user", methods=['GET'])
def refresh_user():
    if current_user == None:
        user = User.query.get(current_user.id)
        return jsonify(user=user.serialize() if user else None)
    else:
        return jsonify(user=None)