"""
CyberShield AI - Main Flask Application Entry Point
====================================================
Initializes the Flask app, registers blueprints (route groups),
enables CORS for the React frontend, and loads configuration
from environment variables.
"""

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from routes.chat import chat_bp
from routes.incidents import incidents_bp
from routes.dashboard import dashboard_bp
from routes.awareness import awareness_bp

# Load environment variables from .env file
load_dotenv()


def create_app() -> Flask:
    """Application factory — creates and configures the Flask app."""
    app = Flask(__name__)

    # ── Security / Config ────────────────────────────────────────────────────
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me-in-production")
    app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024  # 1 MB request limit

    # ── CORS ─────────────────────────────────────────────────────────────────
    # Allow requests from the React dev server (port 3000) and production build
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

    # ── Register route blueprints ─────────────────────────────────────────────
    app.register_blueprint(chat_bp,       url_prefix="/api/chat")
    app.register_blueprint(incidents_bp,  url_prefix="/api/incidents")
    app.register_blueprint(dashboard_bp,  url_prefix="/api/dashboard")
    app.register_blueprint(awareness_bp,  url_prefix="/api/awareness")

    # ── Health-check endpoint ────────────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return {"status": "ok", "service": "CyberShield AI Backend"}

    return app


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=debug)
