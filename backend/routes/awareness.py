"""
Awareness route — /api/awareness
==================================
Handles general cybersecurity awareness / education questions.
"""

from flask import Blueprint, request, jsonify
from services.ai_service import ai_service
from utils.validators import validate_message

awareness_bp = Blueprint("awareness", __name__)


@awareness_bp.route("/ask", methods=["POST"])
def ask():
    """
    POST /api/awareness/ask
    Body: { "question": "<cybersecurity question>" }
    Returns: { "safe_response": bool, "answer": "..." }
    """
    data = request.get_json(silent=True) or {}
    question = data.get("question", "").strip()

    error = validate_message(question)
    if error:
        return jsonify({"error": error}), 400

    result = ai_service.answer_awareness_question(question)
    return jsonify(result), 200
