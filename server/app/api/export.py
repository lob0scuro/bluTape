from flask import jsonify, current_app, Blueprint, request
from app.extensions import db
from app.models import Machine
from flask_login import login_required, current_user
import pandas as pd
from io import BytesIO
from flask_mailman import EmailMessage


export_bp = Blueprint("export", __name__)


def send_metrics_email(admin_email: str, employee_name: str, metrics: dict):
    # Build HTML body
    def machine_list(machines):
        return ", ".join([m["model"] for m in machines]) if machines else "—"

    html_body = f"""
    <h2>Employee Metrics for {employee_name}</h2>
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Category</th><th>Count</th><th>Details</th>
        </tr>
        <tr>
            <td>In Progress</td>
            <td>{len(metrics.get('in_progress', []))}</td>
            <td>{machine_list(metrics.get('in_progress', []))}</td>
        </tr>
        <tr>
            <td>Completed in Range</td>
            <td>{len(metrics.get('completed_in_range', []))}</td>
            <td>{machine_list(metrics.get('completed_in_range', []))}</td>
        </tr>
        <tr>
            <td>Trashed in Range</td>
            <td>{len(metrics.get('trashed_in_range', []))}</td>
            <td>{machine_list(metrics.get('trashed_in_range', []))}</td>
        </tr>
        <tr>
            <td>Total Completed/Trashed</td>
            <td>{metrics.get('count_completed_trashed', 0)}</td>
            <td>—</td>
        </tr>
    </table>
    """

    email = EmailMessage(
        subject=f"Employee Metrics for {employee_name}",
        body=html_body,
        from_email=current_app.config.get("MAIL_DEFAULT_SENDER"),
        to=[admin_email],
    )
    email.content_subtype = "html"  # render as HTML
    email.send()


@export_bp.route("/export_machines", methods=["GET"])
@login_required
def export_machines():
    machines = Machine.query.filter(Machine.status=="completed").all()
    if not machines:
        return jsonify(success=False, message="No machines found"), 404
    data = [{
            "Brand": m.brand,
            "Model": m.model,
            "Serial": m.serial,
            "Style": m.style,
            "Type": m.type_of,
            "Color": m.color,
            "Condition": m.condition,
            "Status": m.status,
            "User": m.creator.first_name,
        } for m in machines]
    output = BytesIO()
    df = pd.DataFrame(data)
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Machines')
    output.seek(0)
  
    try:
        msg = EmailMessage(
            subject="Machine Export",
            body="Attached is the export of machines.",
            to=[current_user.email],
        )
        msg.attach('machine_exports.xlsx', output.getvalue(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        
        msg.send()
        current_app.logger.info(f"{current_user.first_name} {current_user.last_name} has exported xlsx file to {current_user.email}")
    except Exception as e:
        print(f"Email sending error: {e}")
        current_app.logger.warning(f"an error occured when trying to export machines to xlsx: {e}")
        return jsonify(success=False, message="Failed to send email with export attachment."), 500
    try:
        for m in machines:
            m.status = "exported"
        db.session.commit()
    except Exception as e:
        print(f"Error updating machine status: {e}")
        db.session.rollback()
        current_app.logger.warning(f"an error occured when trying to update machine status: {e}")
        return jsonify(success=False, message="Failed to update machine status after export."), 500
    
    return jsonify(success=True, message="Export successful, email sent with attachment."), 200


@export_bp.route("/print_employee_metrics", methods=["POST"])
def print_employee_metrics():
    # Placeholder for future implementation
    data = request.get_json()
    metrics = data.get("metrics", {})
    employee_name = data.get("employee_name", "Unknown")
    admin_email = current_user.email
    
    try:
        send_metrics_email(admin_email, employee_name, metrics)
        return jsonify(success=True, message="Employee metrics emailed successfully."), 200
    except Exception as e:
        print(f"Error sending metrics email: {e}")
        return jsonify(success=False, message="Failed to send employee metrics email."), 500