"""
Safety Filter — detects offensive or harmful cybersecurity queries.
===================================================================
Uses a keyword/pattern list to identify requests that ask for offensive
hacking assistance.  This is a first-pass filter; the LLM system prompt
acts as a second layer of protection.
"""

import re
from typing import List

# ── Offensive keyword/phrase patterns ────────────────────────────────────────
# These patterns indicate a request for offensive capabilities, not defense.
_OFFENSIVE_PATTERNS: List[str] = [
    # Credential theft
    r"\b(steal|harvest|dump|exfiltrate)\b.{0,30}\b(password|credential|hash|token)\b",
    r"\bcreate.{0,20}\bphishing\b.{0,20}\bkit\b",
    r"\bhow to hack\b",
    r"\bhack\s+(into|a)\b",
    # Malware creation
    r"\b(write|create|build|make|code|develop).{0,30}\b(malware|virus|trojan|ransomware|keylogger|spyware|worm|rootkit|rat\b)",
    r"\b(write|create|build)\b.{0,20}\bexploit\b",
    # System exploitation
    r"\b(exploit|pwn|compromise|attack|breach)\b.{0,30}\b(server|system|network|database|website)\b",
    r"\bSQL\s*injection\b.{0,40}\b(how to|tutorial|guide|example)\b",
    r"\b(bypass|evade|disable).{0,30}\b(antivirus|firewall|ids|ips|waf|security)\b",
    # Password attacks
    r"\b(brute\s*force|crack|rainbow\s*table).{0,30}\b(password|hash|login)\b",
    r"\bpassword\s+cracking\b",
    # Unauthorized access
    r"\bgain\s+(unauthorized|illegal|remote)\s+access\b",
    r"\b(ddos|dos)\s+attack\b",
    r"\bcreate\s+(a\s+)?(botnet|c2|command.and.control)\b",
    # Social engineering for malicious use
    r"\bcreate\s+(a\s+)?fake\s+(login|bank|website|page)\b",
    r"\bgenerate\s+(a\s+)?phishing\s+(email|link|page|site)\b",
    # Evasion
    r"\b(obfuscate|hide|conceal)\b.{0,30}\b(malware|payload|shell|backdoor)\b",
    r"\breverse\s+shell\b.{0,20}\b(how|create|make|generate)\b",
]

_COMPILED = [re.compile(p, re.IGNORECASE | re.DOTALL) for p in _OFFENSIVE_PATTERNS]


def is_offensive_request(text: str) -> bool:
    """
    Return True if the text contains patterns that indicate an offensive
    cybersecurity request rather than a defensive/educational one.
    """
    if not text or not text.strip():
        return False
    for pattern in _COMPILED:
        if pattern.search(text):
            return True
    return False
