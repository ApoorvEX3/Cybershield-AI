"""
Incidents route — /api/incidents
=================================
CRUD endpoints for the incident history.
"""

from flask import Blueprint, request, jsonify
from models.incident_store import incident_store

incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.route("/", methods=["GET"])
def list_incidents():
    """GET /api/incidents/ — return all stored incidents (newest first)."""
    limit = request.args.get("limit", 100, type=int)
    return jsonify(incident_store.get_all(limit=limit)), 200


@incidents_bp.route("/<incident_id>", methods=["GET"])
def get_incident(incident_id: str):
    """GET /api/incidents/<id> — return a single incident by ID."""
    incident = incident_store.get_by_id(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    return jsonify(incident), 200


@incidents_bp.route("/<incident_id>", methods=["DELETE"])
def delete_incident(incident_id: str):
    """DELETE /api/incidents/<id> — remove an incident from history."""
    deleted = incident_store.delete(incident_id)
    if not deleted:
        return jsonify({"error": "Incident not found"}), 404
    return jsonify({"message": "Incident deleted"}), 200
