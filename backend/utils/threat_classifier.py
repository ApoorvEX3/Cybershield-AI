"""
Threat Classifier & Severity Assessor — rule-based heuristics.
===============================================================
Used as a fallback when no LLM API key is available, and as a
pre-processing step to help the LLM give better responses.
"""

import re
from typing import Optional

# ── Category patterns ─────────────────────────────────────────────────────────
_CATEGORY_PATTERNS = [
    ("Phishing",          [r"\bphish", r"\bsuspicious\s+(email|link|message)\b", r"\bverify\s+(your|my)\s+(account|bank|password)\b", r"\bcredential\b", r"\bspear.?phish\b"]),
    ("Malware",           [r"\bmalware\b", r"\bvirus\b", r"\btrojan\b", r"\binfect", r"\bmalicious\s+file\b", r"\bdownload.{0,20}suspicious\b"]),
    ("Ransomware",        [r"\bransom", r"\bencrypt.{0,30}file", r"\bfiles?\s+(locked|encrypted)\b", r"\bpay.{0,20}bitcoin\b"]),
    ("Account Compromise",[r"\baccount\s+(hacked|compromised|taken over)\b", r"\bsomeone\s+(else\s+)?logged?\s+in\b", r"\bunauthorized\s+(access|login)\b"]),
    ("Password Attack",   [r"\bpassword\s+(attack|stolen|changed|reset)\b", r"\bbrute\s*force\b", r"\bcredential\s+stuff\b"]),
    ("Social Engineering",[r"\bsocial\s+engineer", r"\bpretexting\b", r"\bimpersonat", r"\bvishing\b", r"\bsmish", r"\bsomeone\s+(called|texted).{0,30}(bank|IT|support)\b"]),
    ("Data Breach",       [r"\bdata\s+breach\b", r"\bpersonal\s+(data|info|information)\s+(leak|exposed|stolen)\b", r"\bleaked?\b.{0,20}\b(data|database|records)\b"]),
    ("Suspicious Login",  [r"\bsuspicious\s+login\b", r"\bunknown\s+(device|location|ip)\b", r"\blogged?\s+in\s+from\b", r"\bstrange\s+(login|sign.?in)\b"]),
    ("Scam",              [r"\bscam\b", r"\bfraud\b", r"\binvestment\s+(scam|fraud)\b", r"\btech\s+support\s+scam\b", r"\bromance\s+scam\b"]),
]

_COMPILED_CATEGORIES = [
    (cat, [re.compile(p, re.IGNORECASE) for p in patterns])
    for cat, patterns in _CATEGORY_PATTERNS
]

# ── Severity keywords ─────────────────────────────────────────────────────────
_CRITICAL_PATTERNS = [
    r"\bransomware\b", r"\bfiles?\s+encrypted\b", r"\baccount\s+(hacked|taken over)\b",
    r"\bbank\s+(account|transfer|credentials)\b", r"\bidentity\s+theft\b",
    r"\bcredit\s+card\b.{0,20}\b(stolen|compromised)\b",
]
_HIGH_PATTERNS = [
    r"\bpassword\s+(stolen|compromised|changed)\b", r"\bunauthorized\s+access\b",
    r"\bmalware\b", r"\bvirus\b", r"\bphishing\b", r"\bdata\s+breach\b",
]
_LOW_PATTERNS = [
    r"\bspam\b", r"\bjunk\s+mail\b", r"\bsuspicious\s+looking\b",
]

_COMPILED_CRITICAL = [re.compile(p, re.IGNORECASE) for p in _CRITICAL_PATTERNS]
_COMPILED_HIGH     = [re.compile(p, re.IGNORECASE) for p in _HIGH_PATTERNS]
_COMPILED_LOW      = [re.compile(p, re.IGNORECASE) for p in _LOW_PATTERNS]


def classify_threat(text: str) -> str:
    """Return the best-matching threat category for the given text."""
    if not text:
        return "Other"
    for category, patterns in _COMPILED_CATEGORIES:
        for pattern in patterns:
            if pattern.search(text):
                return category
    return "Other"


def assess_severity(text: str) -> Optional[str]:
    """
    Return a severity string (Critical / High / Medium / Low) based on
    keyword matching, or None if undetermined.
    """
    if not text:
        return None
    for pattern in _COMPILED_CRITICAL:
        if pattern.search(text):
            return "Critical"
    for pattern in _COMPILED_HIGH:
        if pattern.search(text):
            return "High"
    for pattern in _COMPILED_LOW:
        if pattern.search(text):
            return "Low"
    return "Medium"
