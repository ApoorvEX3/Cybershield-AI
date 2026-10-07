"""
Unit tests for the threat classifier and safety filter utilities.
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from utils.threat_classifier import classify_threat, assess_severity
from utils.safety_filter import is_offensive_request


# ── classify_threat ───────────────────────────────────────────────────────────

def test_classify_phishing():
    assert classify_threat("I got a suspicious email asking me to verify my account") == "Phishing"

def test_classify_malware():
    assert classify_threat("My computer has malware and strange pop-ups") == "Malware"

def test_classify_ransomware():
    assert classify_threat("All my files are encrypted, ransom note on desktop") == "Ransomware"

def test_classify_account_compromise():
    assert classify_threat("Someone hacked my account from another country") == "Account Compromise"

def test_classify_social_engineering():
    assert classify_threat("Someone called pretending to be IT support") == "Social Engineering"

def test_classify_data_breach():
    assert classify_threat("I think there was a data breach at my bank") == "Data Breach"

def test_classify_suspicious_login():
    assert classify_threat("I got an alert about a suspicious login from Germany") == "Suspicious Login"

def test_classify_scam():
    assert classify_threat("I think this is a scam investment offer") == "Scam"

def test_classify_other():
    assert classify_threat("I am not sure what happened") == "Other"


# ── assess_severity ───────────────────────────────────────────────────────────

def test_severity_critical_ransomware():
    sev = assess_severity("My files are encrypted and I have a ransom note")
    assert sev == "Critical"

def test_severity_high_malware():
    sev = assess_severity("There is malware on my computer")
    assert sev == "High"

def test_severity_low_spam():
    sev = assess_severity("I keep getting spam emails")
    assert sev == "Low"


# ── is_offensive_request ──────────────────────────────────────────────────────

def test_offensive_hack_detection():
    assert is_offensive_request("How do I hack into a server?") is True

def test_offensive_malware_creation():
    assert is_offensive_request("Write a trojan in Python") is True

def test_offensive_phishing_kit():
    assert is_offensive_request("Create a phishing kit for me") is True

def test_offensive_password_crack():
    assert is_offensive_request("How do I crack password hashes?") is True

def test_benign_phishing_question():
    # Asking about phishing for education is NOT offensive
    assert is_offensive_request("What is phishing and how do I recognise it?") is False

def test_benign_account_compromise():
    assert is_offensive_request("My account was hacked, what should I do?") is False

def test_empty_string_not_offensive():
    assert is_offensive_request("") is False

def test_none_not_offensive():
    assert is_offensive_request(None) is False
