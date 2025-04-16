from flask import request, jsonify
from app.utils import bp
from app.extensions import db
from flask_login import login_required, current_user
import socket

@bp.route("/zebra", methods=["POST"])
@login_required
def zebra():
    data = request.get_json()
    if not data:
        return jsonify(error="No payload in request."), 404
    zpl = data.get("zpl")
    ip = data.get("ip")
    port = 9100
    try:
        with socket.socket(socket.AF_INET6, socket.SOCK_STREAM) as s:
            s.connect((ip, port))
            s.sendall(zpl.encode("utf-8"))
            print("Job sent to printer")
        return jsonify(message="Job sent to printer."), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(error=f"Server error: {e}"), 500