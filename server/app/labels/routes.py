from flask import request, jsonify, current_app
from app.labels import bp
import socket
from flask_login import current_user
import subprocess

#TODO: update with Pi's tailscale IP
PRINTER_IP = "100.71.48.104"
PRINTER_PORT = 9100

def send_to_pi(zpl):
    user = "cameron"
    subprocess.run(
        ["ssh", f"{user}@{PRINTER_IP}", f"echo '{zpl}' | sudo tee /dev/usb/lp0 > /dev/null"],
        check=True,
    )

def generate_ZPL_label(data):
    zpl = f"""
    ^XA
    ^FO25,25^GB750,360,6^FS
    ^FO90, 60^A0,35^FDbluTape/ Matt's Appliances^FS
    ^FO650, 60^A0,35^FDID: {data["id"]}^FS
    ^FO90,105^BQN,2,9^FDLA,https://blutape.net/card/{data["id"]}^FS
    ^FO350,130^A0,35^FDBrand: {data["brand"]}^FS
    ^FO350,175^A0,35^FDModel: {data["model"]}^FS
    ^FO350,220^A0,35^FDSerial: {data["serial"]}^FS
    ^FO350,265^A0,35^FDStyle: {data["style"]}^FS
    ^FO350,310^A0,35^FDColor: {data["color"]}^FS
    ^XZ
    """
    return zpl

@bp.route("/print_label", methods=['POST'])
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
            return jsonify(error="Missing required fields"), 400
        
        zpl = generate_ZPL_label(data)
        
        #Open socket to Zebra printer via raspberry pi
        # with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        #     s.settimeout(5)
        #     s.connect((PRINTER_IP, PRINTER_PORT))
        #     s.sendall(zpl.encode("utf-8"))
        
        send_to_pi(zpl)
        
            
        current_app.logger.info(f"{current_user.first_name} {current_user.last_name} just printed a label")
        return jsonify(message="Label sent to printer"), 200
    except Exception as e:
        current_app.logger.error(f"Error when sending ZPL: {e}")
        return jsonify(error=f"Error when sending ZPL to printer: {e}"),500
    