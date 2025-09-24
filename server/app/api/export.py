from flask import jsonify, current_app, Blueprint
from app.extensions import db
from app.models import Machine
from flask_login import login_required, current_user
import pandas as pd
from io import BytesIO
from flask_mailman import EmailMessage


export_bp = Blueprint("export", __name__)


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