from flask import jsonify, request, session, url_for, render_template_string, current_app
from app.auth import bp
from app.extensions import db, bcrypt, serializer
from app.models import User
from flask_login import login_user, logout_user, current_user
from flask_mailman import EmailMessage
from itsdangerous import BadSignature, SignatureExpired


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
        login_user(user, remember=True)
        session["user"] = f"{user.first_name} {user.last_name[0]}"
        session["device"] = request.headers.get("User-Agent")
        current_app.logger.info(f"{current_user.first_name} logged in")
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
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        return jsonify(user=user.serialize() if user else None), 200
    return jsonify(user=None), 401


@bp.route("/request_password_reset", methods=['POST'])
def request_reset_password():
    data = request.get_json()
    email = data.get("email")
    
    user = User.query.filter_by(email=email).first()
    
    if user:
        token = serializer.dumps(user.email, salt="password-reset-salt")
        reset_url = f"https://blutape.net/reset-password/{token}"
        
        msg = EmailMessage(
            subject="Reset your password",
            body=f"Click here to reset your password: {reset_url}",
            to=[user.email],
        )
        msg.send()
        return jsonify(message="A reset link has been sent to your email!"), 200
    else:
        return jsonify(error="No user found with this email address"), 404


@bp.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("password")
    check_new_password = data.get("password-check")
    
    if new_password != check_new_password:
        return jsonify(error="Passwords do not match, check inputs and try again"), 400
    
    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
    except SignatureExpired:
        return jsonify(error="Reset link has expired."), 400
    except BadSignature:
        return jsonify(error="Invalid reset token"), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(error="User not found"), 404
    
    try:
        user.password = bcrypt.generate_password_hash(new_password).decode("utf8")
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify(error=f"Error when updating password: {e}"), 500
    
    return jsonify(message="Password updated successfully!"), 200