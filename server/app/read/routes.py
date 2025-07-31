from flask import jsonify, request
from app.read import bp
from app.models import Machine, User, Note, Task
from sqlalchemy import and_
from flask_login import current_user
from app.extensions import db

@bp.route("/get_machine/<int:id>", methods=['GET'])
def get_machine(id):
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify(error="Could not find machine."), 404
        return jsonify(machine=machine.serialize()), 200
    except Exception as e:
        print(f"Error when querying for machine: {e}")
        return jsonify(error=f"Error when querying for machine: {e}"), 500
    
@bp.route("/get_machines", methods=['GET'])
def get_machines():
    try:
        status = request.args.get('status', 'all').lower()
        type_id = request.args.get('type_id', default=0, type=int)
        
        page = request.args.get('page', default=1, type=int)
        limit = request.args.get('limit', default=10, type=int)
        
        query = Machine.query.filter(Machine.status != "deleted")
        
        if status in ["queued", "cleaned", "export"]:
            query = query.filter(Machine.status == status)
        
        if type_id != 0:
            query = query.filter(Machine.type_id == type_id)
            
        total = query.count()
            
        machines = (
            query
            .order_by(Machine.repaired_on.asc())
            .offset((page -1) * limit)
            .limit(limit)
            .all()
        )
        
        return jsonify(
            machines=[machine.serialize() for machine in machines],
            total=total,
            page=page,
            limit=limit
            )
    except Exception as e:
        print(f"Error when querying machines: {e}")
        return jsonify(error=f"Error when querying machines: {e}"), 500

    
#/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
    

    
@bp.route("/get_machine_notes/<int:machine_id>", methods=["GET"])
def get_machine_notes(machine_id):
    try:
        notes = Note.query.filter_by(machine_id=machine_id).all()
        if not notes:
            return jsonify(error="Could not locate notes for this machine."), 400
        return jsonify(notes=[note.serialize() for note in notes]), 200
    except Exception as e:
        print(f"Error when querying machine notes: {e}")
        return jsonify(error=f"Error when querying machine notes: {e}"), 500
    
@bp.route("/get_user_notes", methods=["GET"])
def get_user_notes():
    try:
        notes = Note.query.filter_by(user_id=current_user.id).all()
        if not notes:
            return jsonify(error="Could not locate notes for this user."), 400
        return jsonify(notes=[note.serialize() for note in notes]), 200
    except Exception as e:
        print(f"Error when querying user notes: {e}")
        return jsonify(error=f"Error when querying user notes: {e}"), 500
    
@bp.route("/get_user_tasks/<int:id>/<status>", methods=['GET'])
def get_user_tasks(id, status):
    status = int(status)
    try:
        if status == -1:
            tasks = Task.query.filter(Task.user_id==id).all()
        else:
            tasks = Task.query.filter(and_(Task.user_id==id, Task.is_complete==bool(status))).all()
        if not tasks:
            return jsonify(tasks=[]), 200
        return jsonify(tasks=[task.serialize() for task in tasks]), 200
    except Exception as e:
        print(f"Error when querying for users tasks: {e}")
        return jsonify(error=f"Error when querying for users tasks: {e}"), 500
    
@bp.route("/get_user_wrap_ups/<int:id>", methods=['GET'])
def get_user_wrap_ups(id):
    try:
        wrap_ups = (
            db.session.query(Machine)
            .filter((and_(Machine.repaired_by == id, Machine.status == "queued")))
            .order_by(Machine.id.desc())
            .limit(10)
            .all()
        )
        return jsonify(wrap_ups=[machine.serialize() for machine in wrap_ups])
    except Exception as e:
        print(f"Error when querying for wrap ups: {e}")
        return jsonify(error=f"Error when querying for wrap ups: {e}"), 500

@bp.route("/get_user/<int:id>", methods=['GET'])
def get_user(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify("Could not find user."), 404
        return jsonify(user=user.serialize()), 200
    except Exception as e:
        print(f"Error when querying for user: {e}")
        return jsonify(error=f"Error when querying for user: {e}"), 500
    
@bp.route("/get_users", methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        if not users:
            return jsonify(error="Could not query users."), 400
        return jsonify(users=[user.serialize() for user in users]), 200
    except Exception as e:
        print(f"Error when querying for all users: {e}")
        return jsonify(error=f"Error when querying for all users: {e}"), 500
    

        