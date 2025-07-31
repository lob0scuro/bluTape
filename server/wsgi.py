from app import create_app
from app.config_flags import dev_mode

app = create_app()


if dev_mode and __name__ == "__main__":
    app.run(port=8000, debug=True)