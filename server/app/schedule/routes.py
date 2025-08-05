from flask import jsonify, request, current_app
from app.schedule import bp
from app.extensions import db
from app.models import Schedule, User
from datetime import datetime, timedelta


@bp.route("/input_week", methods=["POST"])
def input_week():
    data = request.get_json()
    if not data:
        return jsonify(error="No data in payload"), 400
    user_id = data.get("employee")
    week_date_str = data.get("week_date")
    
    if not user_id or not week_date_str:
        return jsonify(error="missing employee or date"), 400
    
    try:
        selected_date = datetime.strptime(week_date_str, "%Y-%m-%d").date()
        if selected_date.weekday() != 0:
            return jsonify(error="week day must be a Monday"), 400
        week_of = selected_date - timedelta(days=selected_date.weekday())
    except ValueError:
        return jsonify(error="Invalid date format, expected: YYYY-MM-DD")
        
    user = User.query.get(user_id)
    if not user:
        return jsonify(error="User not found"), 404
    
    mon_start = data.get("mon_start")
    mon_end = data.get("mon_end")
    tue_start = data.get("tue_start")
    tue_end = data.get("tue_end")
    wed_start = data.get("wed_start")
    wed_end = data.get("wed_end")
    thu_start = data.get("thu_start")
    thu_end = data.get("thu_end")
    fri_start = data.get("fri_start")
    fri_end = data.get("fri_end")
    sat_start = data.get("sat_start")
    sat_end = data.get("sat_end")
    
    existing = Schedule.query.filter_by(user_id=user_id, week_of=week_of).first()
    
    if existing:
        return jsonify(error="Schedule already exists for this user and week."), 400
    
    try:
    
        stamp_week = Schedule(
            user_id=user_id,
            week_of=week_of,
            mon_start=mon_start,
            mon_end=mon_end,
            tue_start=tue_start,
            tue_end=tue_end,
            wed_start=wed_start,
            wed_end=wed_end,
            thu_start=thu_start,
            thu_end=thu_end,
            fri_start=fri_start,
            fri_end=fri_end,
            sat_start=sat_start,
            sat_end=sat_end,
            submitted=True,
        )
        db.session.add(stamp_week)
        db.session.commit()       
        
        return jsonify(message="Schedule has been posted")
    except Exception as e:
        current_app.logger.info(f"Error when submitting schedule: {e}")
        return jsonify(error="There was an error when submitting the schedule"), 500
    
    
@bp.route("/update_schedule", methods=["PATCH"])
def update_schedule():
    data = request.get_json()
    if not data:
        return jsonify(error="No data in payload"), 400

    user_id = data.get("employee")
    week_date_str = data.get("week_date")

    if not user_id or not week_date_str:
        return jsonify(error="Missing employee or week date"), 400

    try:
        selected_date = datetime.strptime(week_date_str, "%Y-%m-%d").date()
        if selected_date.weekday() != 0:
            return jsonify(error="week_date must be a Monday"), 400
        week_of = selected_date
    except ValueError:
        return jsonify(error="Invalid date format. Expected YYYY-MM-DD"), 400

    schedule = Schedule.query.filter_by(user_id=user_id, week_of=week_of).first()
    if not schedule:
        return jsonify(error="Schedule not found for this user and week"), 404

    try:
        # List of time fields that can be updated
        fields = [
            "mon_start", "mon_end", "tue_start", "tue_end", "wed_start", "wed_end",
            "thu_start", "thu_end", "fri_start", "fri_end", "sat_start", "sat_end"
        ]

        for field in fields:
            if field in data:
                setattr(schedule, field, data[field])

        db.session.commit()
        return jsonify(message="Schedule updated successfully")
    except Exception as e:
        current_app.logger.error(f"Error updating schedule: {e}")
        return jsonify(error="There was an error updating the schedule"), 500


@bp.route("/delete_schedule", methods=["DELETE"])
def delete_schedule():
    data = request.get_json()
    if not data:
        return jsonify(error="No data in payload"), 400

    user_id = data.get("employee")
    week_date_str = data.get("week_date")

    if not user_id or not week_date_str:
        return jsonify(error="Missing employee or week date"), 400

    try:
        selected_date = datetime.strptime(week_date_str, "%Y-%m-%d").date()
        if selected_date.weekday() != 0:
            return jsonify(error="week_date must be a Monday"), 400
        week_of = selected_date
    except ValueError:
        return jsonify(error="Invalid date format. Expected YYYY-MM-DD"), 400

    schedule = Schedule.query.filter_by(user_id=user_id, week_of=week_of).first()
    if not schedule:
        return jsonify(error="Schedule not found for this user and week"), 404

    try:
        db.session.delete(schedule)
        db.session.commit()
        return jsonify(message="Schedule deleted successfully")
    except Exception as e:
        current_app.logger.error(f"Error deleting schedule: {e}")
        return jsonify(error="There was an error deleting the schedule"), 500
