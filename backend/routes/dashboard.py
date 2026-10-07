"""
Dashboard route — /api/dashboard
==================================
Returns aggregate statistics for the frontend dashboard.
"""

from flask import Blueprint, jsonify
from models.incident_store import incident_store

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/stats", methods=["GET"])
def stats():
    """GET /api/dashboard/stats — return incident statistics."""
    return jsonify(incident_store.stats()), 200
