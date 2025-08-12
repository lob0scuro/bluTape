import logging
from logging.handlers import RotatingFileHandler
import os
from app.config_flags import dev_mode

work_path = "C:\\Users\\latin\\Desktop\\log"
personal_path = "C:\\Users\\camer\\OneDrive\\Desktop\\log"


def setup_logging(app):
    log_dir = "/var/log/bluTape" if not dev_mode else work_path
    log_file = os.path.join(log_dir, "app.log")
    
    file_handler = RotatingFileHandler(log_file, maxBytes=10_000_000, backupCount=5)
    
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] in %(module)s: %(message)s"
    )
    file_handler.setFormatter(formatter)
    
    file_handler.setLevel(logging.INFO)
    
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    
    