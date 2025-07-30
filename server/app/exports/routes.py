from flask import jsonify, request, send_file
from app.exports import bp
from app.extensions import db
from app.models import Machine
from flask_login import login_required, current_user
import pandas as pd
from io import BytesIO
from sqlalchemy import and_
from flask_mailman import EmailMessage

@bp.route("/export_table", methods=["GET"])
@login_required
def export_table():
    machines = Machine.query.filter(and_(Machine.is_clean==True, Machine.is_exported==True)).all()
    if not machines:
        return jsonify(error="No machines found"), 404
    data = [{
            "Brand": m.brand,
            "Model": m.model,
            "Serial": m.serial,
            "Style": m.style,
            "Type": m.machine_type.name if m.machine_type else None,
            "Color": m.color,
        } for m in machines]
    
    output = BytesIO()
    df = pd.DataFrame(data)
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Machines')
    output.seek(0)
    
    # add email logic here
    #
    #
    #
    try:
        
        msg = EmailMessage(
            subject="Machine Export",
            body="Attached is the export of machines.",
            to=[current_user.email],
        )
        msg.attach('machine_exports.xlsx', output.getvalue(), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        
        msg.send()
    except Exception as e:
        print(f"Email sending error: {e}")
        return jsonify(error="Failed to send email with export attachment."), 500
    
    for m in machines:
        m.is_clean = False
        m.is_exported = False
        # m.is_deleted = True
    db.session.commit()
    
    return jsonify(message="Export successful, email sent with attachment."), 200