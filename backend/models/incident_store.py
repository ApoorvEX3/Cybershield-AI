"""
In-memory incident store (and optional JSON persistence).
==========================================================
For a production system this would be replaced with a proper database
(PostgreSQL, SQLite via SQLAlchemy, etc.).  For a student demo project,
a simple in-memory list with optional JSON file persistence is enough.
"""

import json
import os
import uuid
from datetime import datetime, timezone
from typing import List, Optional


_STORE_FILE = os.getenv("INCIDENT_STORE_FILE", "incidents.json")


class IncidentStore:
    """Thread-unsafe in-memory store — sufficient for single-process demos."""

    def __init__(self):
        self._incidents: List[dict] = []
        self._load_from_disk()

    # ── CRUD ─────────────────────────────────────────────────────────────────

    def add(self, user_message: str, analysis: dict) -> dict:
        """Persist a new incident and return it with generated metadata."""
        incident = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user_message": user_message,
            "threat_category": analysis.get("threat_category", "Other"),
            "severity": analysis.get("severity", "Unknown"),
            "severity_reason": analysis.get("severity_reason", ""),
            "summary": analysis.get("summary", ""),
            "immediate_actions": analysis.get("immediate_actions", []),
            "prevention_tips": analysis.get("prevention_tips", []),
            "indicators_of_compromise": analysis.get("indicators_of_compromise", []),
            "safe_response": analysis.get("safe_response", True),
        }
        self._incidents.insert(0, incident)  # newest first
        self._save_to_disk()
        return incident

    def get_all(self, limit: int = 100) -> List[dict]:
        return self._incidents[:limit]

    def get_by_id(self, incident_id: str) -> Optional[dict]:
        return next((i for i in self._incidents if i["id"] == incident_id), None)

    def delete(self, incident_id: str) -> bool:
        before = len(self._incidents)
        self._incidents = [i for i in self._incidents if i["id"] != incident_id]
        self._save_to_disk()
        return len(self._incidents) < before

    # ── Statistics (used by the dashboard) ───────────────────────────────────

    def stats(self) -> dict:
        """Return aggregate statistics for the dashboard."""
        total = len(self._incidents)
        if total == 0:
            return {
                "total": 0,
                "high_critical": 0,
                "most_common_category": "—",
                "recent": [],
            }

        # Count high/critical
        high_critical = sum(
            1 for i in self._incidents if i["severity"] in ("High", "Critical")
        )

        # Most common category
        from collections import Counter
        categories = [i["threat_category"] for i in self._incidents]
        most_common_category = Counter(categories).most_common(1)[0][0]

        # Category breakdown for charts
        category_counts = dict(Counter(categories))

        # Severity breakdown
        severities = [i["severity"] for i in self._incidents]
        severity_counts = dict(Counter(severities))

        return {
            "total": total,
            "high_critical": high_critical,
            "most_common_category": most_common_category,
            "category_counts": category_counts,
            "severity_counts": severity_counts,
            "recent": self._incidents[:5],
        }

    # ── Persistence ───────────────────────────────────────────────────────────

    def _save_to_disk(self):
        try:
            with open(_STORE_FILE, "w") as f:
                json.dump(self._incidents, f, indent=2)
        except OSError:
            pass  # If we can't write, continue in-memory

    def _load_from_disk(self):
        if os.path.exists(_STORE_FILE):
            try:
                with open(_STORE_FILE) as f:
                    self._incidents = json.load(f)
            except (json.JSONDecodeError, OSError):
                self._incidents = []


# Module-level singleton shared across all requests
incident_store = IncidentStore()
