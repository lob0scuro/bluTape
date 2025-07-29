from flask import jsonify, request, send_file
from app.exports import bp
from app.extensions import db
from app.models import Machine
from flask_login import login_required
import pandas as pd
from io import BytesIO
from sqlalchemy import and_

@bp.route("/export_table", methods=["GET"])
@login_required
def export_table():
    machines = Machine.query.filter(and_(Machine.is_clean==True, Machine.is_exported==True)).all()
    if not machines:
        return jsonify(message="No machines found"), 404
    data = [{
            "model": m.model,
            "serial": m.serial,
            "style": m.style,
            "color": m.color,
            "type": m.machine_type.name if m.machine_type else None,
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
    
    for m in machines:
        m.is_clean = False
        m.is_exported = False
    db.session.commit()
    
    return send_file(
        output,
        download_name='machines_export.xlsx',
        as_attachment=True,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )