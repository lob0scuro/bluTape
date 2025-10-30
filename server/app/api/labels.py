from flask import request, jsonify, current_app, Blueprint
import socket
import requests
from flask_login import current_user

labels_bp = Blueprint("labels", __name__)

#TODO: update with Pi's tailscale IP
PRINTER_IP = "100.71.48.104"
ZEBRA_IP = "192.168.1.155"
PRINTER_PORT = 5000
URL = "http://100.71.48.104:5000/print"


def generate_ZPL_label(data):
    zpl = f"""
    ^XA
    ^FO10,25^GB775,365,6^FS
    ^FO50, 60^A0,35^FDbluTape/ Matt's Appliances^FS
    ^FO530, 60^A0,35^FDID: {data["id"]}^FS
    ^FO50,105^BQN,2,9^FDLA,{data["id"]}^FS
    ^FO300,130^A0,35^FDBrand: {data["brand"]}^FS
    ^FO300,175^A0,35^FDModel: {data["model"]}^FS
    ^FO300,220^A0,35^FDSerial: {data["serial"]}^FS
    ^FO300,265^A0,35^FDStyle: {data["style"]}^FS
    ^FO300,310^A0,35^FDColor: {data["color"]}^FS
    ^XZ
    """
    return zpl

@labels_bp.route("/print_label", methods=['POST'])
def print_label():
    """
    Accepts JSON like:
    {
        "id": "machine id",
        "model": "Machine Model Number",
        "serial": "Serial number", 
        "brand": "Machine brand",
        "style": "Machine style",
        "color": "Machine color"
    }
    Generates ZPL and sends it to the Zebra printer via Raspberry Pi (Tailscale).
    """
    try:
        data = request.get_json()
        required_fields = ["id", "model", "serial", "brand", "style", "color"]
        
        if not data or any(field not in data for field in required_fields):
            return jsonify(success=False, message="Missing required fields"), 400
        
        zpl = generate_ZPL_label(data)
        
        response = requests.post(URL, data=zpl)
        
        if response.status_code == 200:
            current_app.logger.info(f"{current_user.first_name} {current_user.last_name} just printed a label")
            return jsonify(success=True, message="Label sent to printer successfully"), 200
        else:
            current_app.logger.error(f"Failed to send label to printer: {response.text}")
            return jsonify(success=False, message=f"Failed to send label to printer: Error({response.text})"), 500
        
        #Open socket to Zebra printer via raspberry pi
        # with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        #     s.settimeout(5)
        #     s.connect((PRINTER_IP, PRINTER_PORT))
        #     s.sendall(zpl.encode("utf-8"))
        
        
            
    except Exception as e:
        current_app.logger.error(f"Error when sending ZPL: {e}")
        return jsonify(success=False, message=f"Error when sending ZPL to printer: {e}"),500
    