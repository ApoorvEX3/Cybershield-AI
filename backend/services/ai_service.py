"""
AI Service — wraps OpenAI (or a local fallback) for cybersecurity analysis.
===========================================================================
All AI calls go through this module so the rest of the app never imports
the OpenAI library directly.  If no API key is configured the service
returns a deterministic rule-based fallback so the project can be
demonstrated without spending tokens.
"""

import os
import json
import re
from typing import Optional

# Optional OpenAI import — graceful fallback if not installed / no key
try:
    from openai import OpenAI
    _openai_available = True
except ImportError:
    _openai_available = False

from utils.safety_filter import is_offensive_request
from utils.threat_classifier import classify_threat, assess_severity


# ── System prompt ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are CyberShield AI, a professional and friendly cybersecurity assistant.
Your sole purpose is DEFENSIVE cybersecurity: helping users understand and respond to
security incidents, providing educational information, and recommending protective measures.

STRICT RULES — you must NEVER violate these:
1. Never provide instructions for hacking, cracking, exploiting, or bypassing security controls.
2. Never help create malware, ransomware, spyware, phishing kits, or any offensive tool.
3. Never provide credential theft techniques or social-engineering scripts for malicious use.
4. If a request is offensive or harmful, politely decline and redirect to defensive education.

When analysing an incident always respond with a JSON object matching this schema:
{
  "threat_category": "<one of: Phishing | Malware | Ransomware | Account Compromise | Password Attack | Social Engineering | Data Breach | Suspicious Login | Scam | Other>",
  "severity": "<Low | Medium | High | Critical>",
  "severity_reason": "<one-sentence explanation>",
  "summary": "<2-3 sentence plain-English description of the threat>",
  "immediate_actions": ["<action 1>", "<action 2>", ...],
  "prevention_tips": ["<tip 1>", "<tip 2>", ...],
  "indicators_of_compromise": ["<ioc 1>", "<ioc 2>", ...],
  "safe_response": true
}

If the request is offensive or asks for harmful information, return:
{
  "safe_response": false,
  "refusal_message": "<polite refusal with educational redirect>"
}
"""

# ── Fallback rule-based analysis (no API key needed) ─────────────────────────
_FALLBACK_RESPONSES = {
    "Phishing": {
        "threat_category": "Phishing",
        "severity": "High",
        "severity_reason": "Phishing attacks directly target credentials and sensitive data.",
        "summary": (
            "This appears to be a phishing attempt. Attackers impersonate trusted entities "
            "to steal credentials or install malware. Do not interact with suspicious links or attachments."
        ),
        "immediate_actions": [
            "Do NOT click any links or download attachments in the suspicious message.",
            "Report the email as phishing to your email provider.",
            "If you already clicked a link, change your password immediately.",
            "Enable Multi-Factor Authentication (MFA) on all accounts.",
            "Notify your IT/security team if this occurred at work.",
        ],
        "prevention_tips": [
            "Verify sender addresses carefully — attackers use lookalike domains.",
            "Hover over links before clicking to inspect the actual URL.",
            "Use a password manager so you notice when a site is fake.",
            "Enable email filtering and anti-phishing tools.",
            "Attend regular security awareness training.",
        ],
        "indicators_of_compromise": [
            "Unexpected request for credentials or personal data",
            "Mismatched or suspicious sender domain",
            "Urgent or threatening language",
            "Suspicious link or attachment",
        ],
        "safe_response": True,
    },
    "Malware": {
        "threat_category": "Malware",
        "severity": "High",
        "severity_reason": "Malware can steal data, encrypt files, or provide attacker access.",
        "summary": (
            "A potential malware infection has been detected. Malware includes viruses, "
            "trojans, spyware, and ransomware that compromise system integrity."
        ),
        "immediate_actions": [
            "Disconnect the affected device from the internet and network immediately.",
            "Do NOT pay any ransom demands.",
            "Run a full antivirus/anti-malware scan (e.g., Malwarebytes, Windows Defender).",
            "Preserve evidence — take screenshots or photos before removing malware.",
            "Contact your IT/security team or a professional for remediation.",
            "If a work device, follow your organisation's incident response procedure.",
        ],
        "prevention_tips": [
            "Keep your operating system and software fully patched and updated.",
            "Never download software from untrusted sources.",
            "Use reputable antivirus software with real-time protection.",
            "Enable your firewall at all times.",
            "Back up important data regularly using the 3-2-1 backup strategy.",
        ],
        "indicators_of_compromise": [
            "Unexpected system slowdown or crashes",
            "Unusual network activity",
            "Files encrypted or renamed",
            "Unexpected pop-ups or ransom notes",
        ],
        "safe_response": True,
    },
    "Account Compromise": {
        "threat_category": "Account Compromise",
        "severity": "Critical",
        "severity_reason": "Compromised accounts give attackers full access to your data and identity.",
        "summary": (
            "Your account may have been compromised. Attackers can use stolen accounts "
            "to steal data, impersonate you, or pivot to other systems."
        ),
        "immediate_actions": [
            "Change your password immediately from a DIFFERENT, trusted device.",
            "Enable Multi-Factor Authentication (MFA) right away.",
            "Review recent account activity and revoke unknown sessions.",
            "Check if other accounts use the same password and change those too.",
            "Notify the service provider's security/support team.",
            "Check haveibeenpwned.com to see if your email was in a known breach.",
        ],
        "prevention_tips": [
            "Use a unique, strong password for every account.",
            "Use a reputable password manager (e.g., Bitwarden, 1Password).",
            "Always enable MFA, preferably using an authenticator app not SMS.",
            "Monitor accounts regularly for suspicious activity.",
            "Never reuse passwords across different services.",
        ],
        "indicators_of_compromise": [
            "Login from unrecognised location or device",
            "Password changed without your action",
            "Unexpected account activity or sent messages",
            "Account recovery email/phone changed",
        ],
        "safe_response": True,
    },
}

_DEFAULT_FALLBACK = {
    "threat_category": "Other",
    "severity": "Medium",
    "severity_reason": "Insufficient information to fully classify, treat with caution.",
    "summary": (
        "A potential cybersecurity concern has been identified. Review the details carefully "
        "and follow recommended defensive practices."
    ),
    "immediate_actions": [
        "Do not act hastily — pause and verify the situation.",
        "Consult your IT/security team if in doubt.",
        "Document all relevant details (timestamps, screenshots).",
        "Change passwords for potentially affected accounts.",
        "Enable MFA on all important accounts.",
    ],
    "prevention_tips": [
        "Keep software and operating systems updated.",
        "Use strong, unique passwords with a password manager.",
        "Enable MFA on all accounts that support it.",
        "Be sceptical of unsolicited communications.",
        "Regularly back up important data.",
    ],
    "indicators_of_compromise": ["See user description above."],
    "safe_response": True,
}


class AIService:
    """Provides AI-powered cybersecurity analysis."""

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.model = os.getenv("AI_MODEL", "gpt-4o-mini")
        self._client: Optional[object] = None

        if self.api_key and _openai_available:
            self._client = OpenAI(api_key=self.api_key)

    # ── Public interface ──────────────────────────────────────────────────────

    def analyze_incident(self, user_message: str) -> dict:
        """
        Analyse a cybersecurity incident described in plain English.
        Returns a structured dict with threat category, severity, actions, etc.
        """
        # Safety filter — block offensive requests before calling the LLM
        if is_offensive_request(user_message):
            return {
                "safe_response": False,
                "refusal_message": (
                    "I'm designed exclusively for DEFENSIVE cybersecurity. "
                    "I cannot provide instructions for offensive activities such as "
                    "hacking, malware creation, or credential theft. "
                    "If you have a genuine security concern, please describe it and "
                    "I'll help you defend against it."
                ),
            }

        if self._client:
            return self._openai_analyze(user_message)
        else:
            return self._fallback_analyze(user_message)

    def answer_awareness_question(self, question: str) -> dict:
        """Answer a general cybersecurity awareness question."""
        if is_offensive_request(question):
            return {
                "safe_response": False,
                "answer": (
                    "That question touches on offensive techniques I'm not able to assist with. "
                    "I'm here for defensive security education only."
                ),
            }

        if self._client:
            return self._openai_awareness(question)
        else:
            return {
                "safe_response": True,
                "answer": self._fallback_awareness(question),
            }

    # ── OpenAI calls ──────────────────────────────────────────────────────────

    def _openai_analyze(self, message: str) -> dict:
        """Call the OpenAI API to analyse an incident."""
        try:
            response = self._client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": f"Analyse this cybersecurity incident:\n\n{message}"},
                ],
                temperature=0.3,
                max_tokens=1000,
                response_format={"type": "json_object"},
            )
            raw = response.choices[0].message.content
            result = json.loads(raw)
            result["safe_response"] = result.get("safe_response", True)
            return result
        except Exception as exc:
            # Fallback on any API error
            fallback = self._fallback_analyze(message)
            fallback["api_error"] = str(exc)
            return fallback

    def _openai_awareness(self, question: str) -> dict:
        """Call the OpenAI API for an awareness question."""
        awareness_prompt = (
            "You are CyberShield AI, a friendly cybersecurity educator. "
            "Answer the following cybersecurity awareness question clearly and simply. "
            "Use plain English suitable for a non-technical user. "
            "If the question is offensive or asks for harmful information, politely decline."
        )
        try:
            response = self._client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": awareness_prompt},
                    {"role": "user",   "content": question},
                ],
                temperature=0.5,
                max_tokens=600,
            )
            return {
                "safe_response": True,
                "answer": response.choices[0].message.content.strip(),
            }
        except Exception as exc:
            return {
                "safe_response": True,
                "answer": self._fallback_awareness(question),
                "api_error": str(exc),
            }

    # ── Rule-based fallback (no API key) ──────────────────────────────────────

    def _fallback_analyze(self, message: str) -> dict:
        """Deterministic rule-based analysis used when no API key is set."""
        category = classify_threat(message)
        if category in _FALLBACK_RESPONSES:
            result = dict(_FALLBACK_RESPONSES[category])
        else:
            result = dict(_DEFAULT_FALLBACK)

        # Override severity with rule-based assessment
        severity = assess_severity(message)
        if severity:
            result["severity"] = severity

        result["mode"] = "fallback"  # tell the frontend no LLM was used
        return result

    def _fallback_awareness(self, question: str) -> str:
        """Simple canned awareness answers for demo without API key."""
        q = question.lower()
        if "phishing" in q:
            return (
                "Phishing is a cyberattack where criminals send fraudulent messages — usually emails — "
                "pretending to be a trustworthy entity to trick you into revealing sensitive information "
                "like passwords or credit-card numbers. Always verify sender addresses, hover over links "
                "before clicking, and never enter credentials on a page you reached via an email link."
            )
        if "password" in q or "passphrase" in q:
            return (
                "A strong password is long (at least 12 characters), unique to each account, and combines "
                "letters, numbers, and symbols. Use a password manager to generate and store them safely. "
                "Never reuse passwords — if one site is breached, all reused accounts become vulnerable."
            )
        if "mfa" in q or "two-factor" in q or "2fa" in q:
            return (
                "Multi-Factor Authentication (MFA) adds a second verification step beyond your password — "
                "such as a code from an authenticator app. Even if your password is stolen, an attacker "
                "cannot access your account without the second factor. Always enable MFA where available."
            )
        if "vpn" in q:
            return (
                "A VPN (Virtual Private Network) encrypts your internet connection and hides your IP address. "
                "It's especially important on public Wi-Fi where attackers can intercept unencrypted traffic. "
                "Choose a reputable, no-log VPN provider."
            )
        if "ransomware" in q:
            return (
                "Ransomware is malware that encrypts your files and demands payment to restore them. "
                "Protect yourself by keeping regular backups (3-2-1 strategy), keeping software patched, "
                "never clicking suspicious links, and using reputable antivirus software."
            )
        return (
            "Cybersecurity is the practice of protecting systems, networks, and data from digital attacks. "
            "Key practices include: using strong unique passwords, enabling MFA, keeping software updated, "
            "being cautious with emails and links, and backing up important data regularly."
        )


# Module-level singleton
ai_service = AIService()
