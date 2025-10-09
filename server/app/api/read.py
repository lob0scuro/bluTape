from flask import jsonify, request, Blueprint, current_app
from app.extensions import db
from flask_login import current_user
from app.models import Machine, Note, User
from datetime import datetime, timezone

read_bp = Blueprint("read", __name__)

@read_bp.route("/get_machine/<int:id>", methods=["GET"])
def get_machine(id):
    if not int(id):
        return jsonify(success=False, message="Invalid Machine ID")
    try:
        machine = Machine.query.get(id)
        if not machine:
            return jsonify(success=False, message="Machine not found."), 404
        return jsonify(success=True, data=machine.serialize()), 200
    except Exception as e:
        current_app.logger.error(f"Error when querying for machine {id}: {e}")
        return jsonify(success=False, message="Could not query machine."), 500
    
@read_bp.route("/get_machines/<status>", methods=["GET"])
def get_machines(status):
    status = status.lower()
    try:
        if status not in ["in_progress", "completed", "trashed", "exported", "all"]:
            return jsonify(success=False, message="status sent was invalid."), 400
        
        query = Machine.query
        
        if status != "all":
            query = query.filter_by(status=status)
            
        created_by = request.args.get("created_by", type=int)
        
        if created_by:
            query = query.filter_by(created_by=created_by)
            
        machines = query.all()
        
        return jsonify(success=True, data=[m.serialize() for m in machines]), 200
    except Exception as e:
        current_app.logger.error(f"Error when querying for machines with status {status}: {e}")
        return jsonify(success=False, message=f"There was an error when querying for machines"), 500
    
@read_bp.route("/machines", methods=["GET"])
def get_filtered_machines():
    try:
        
        # Get query parameters
        status = request.args.get("status", type=str)
        vendor = request.args.get("vendor", type=str)
        type_of = request.args.get("type_of", type=str)
        tech_id = request.args.get("tech_id", type=int)

        query = Machine.query

        # Filter by status
        if status and status.lower() != "all":
            if status.lower() not in ["in_progress", "completed", "trashed", "exported"]:
                return jsonify(success=False, message="Invalid status"), 400
            query = query.filter_by(status=status.lower())

        # Filter by vendor
        if vendor:
            query = query.filter_by(vendor=vendor.lower())

        # Filter by machine type
        if type_of:
            query = query.filter_by(type_of=type_of.lower())

        # Filter by technician
        if tech_id:
            query = query.join(Machine.technicians).filter(User.id == tech_id)

        machines = query.all()
        return jsonify(success=True, data=[m.serialize() for m in machines]), 200

    except Exception as e:
        current_app.logger.error(f"Error querying machines with filters: {e}")
        return jsonify(success=False, message="Error querying machines."), 500

@read_bp.route("/get_id_by_serial/<serial_number>", methods=["GET"])
def get_id_by_serial(serial_number):
    serial_number = serial_number.strip().upper()
    try:
        machine = Machine.query.filter_by(serial=serial_number).first()
        if not machine:
            return jsonify(success=False, message="Machine not found."), 404
        return jsonify(success=True, data=machine.id), 200
    except Exception as e:
        current_app.logger.error(f"Error when querying for machine with serial number {serial_number}: {e}")
        return jsonify(success=False, message="There was an error when querying for machine."), 500


@read_bp.route("/get_user/<int:id>", methods=['GET'])
def get_user(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify(success=False, message="User not found."), 404
        return jsonify(success=True, data=user.serialize()), 200
    except Exception as e:
        current_app.logger.error(f"Error when querying for user with id {id}: {e}")
        return jsonify(success=False, message="There was an error when querying for user."), 500
    
@read_bp.route("/get_user_metrics/<int:id>", methods=['GET'])
def get_user_metrics(id):
    try:
        user = User.query.get(id)
        if not user:
            return jsonify(success=False, message="User not found."), 404
        
        start_str = request.args.get("start")
        end_str = request.args.get("end")
        
        if not start_str or not end_str:
            return jsonify(success=False, message="Start and end date parameters are required."), 400
        
        try:
            start = datetime.fromisoformat(start_str).replace(tzinfo=timezone.utc)
            end = datetime.fromisoformat(end_str).replace(tzinfo=timezone.utc)
        except ValueError:
            return jsonify(success=False, message="Invalid date format. Use ISO format."), 400
        
        metrics = user.metrics_in_range(start, end)
        
        return jsonify(success=True, data=metrics), 200
    except Exception as e:
        current_app.logger.error(f"Error when querying for user metrics with id {id}: {e}")
        return jsonify(success=False, message="There was an error when querying for user metrics."), 500



@read_bp.route("/get_users", methods=['GET'])
def get_users():
    try:
        users = User.query.order_by(User.last_name.asc()).all()
        return jsonify(success=True, data=[u.serialize() for u in users]), 200
    except Exception as e:
        current_app.logger.error(f"Error when querying for users: {e}")
        return jsonify(success=False, message="There was an error when querying for users"), 500
