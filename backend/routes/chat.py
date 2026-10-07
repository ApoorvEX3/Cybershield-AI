"""
Chat route — /api/chat
======================
Accepts a user message, passes it to the AI service,
stores the resulting incident, and returns the analysis.
"""

from flask import Blueprint, request, jsonify
from services.ai_service import ai_service
from models.incident_store import incident_store
from utils.validators import validate_message

chat_bp = Blueprint("chat", __name__)


@chat_bp.route("/analyze", methods=["POST"])
def analyze():
    """
    POST /api/chat/analyze
    Body: { "message": "<user description of incident>" }
    Returns: structured analysis dict
    """
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()

    # Input validation
    error = validate_message(message)
    if error:
        return jsonify({"error": error}), 400

    # Get AI analysis
    analysis = ai_service.analyze_incident(message)

    # Persist incident only if the response was safe (not a refusal)
    if analysis.get("safe_response", True) and "threat_category" in analysis:
        incident = incident_store.add(message, analysis)
        analysis["incident_id"] = incident["id"]
        analysis["timestamp"] = incident["timestamp"]

    return jsonify(analysis), 200
