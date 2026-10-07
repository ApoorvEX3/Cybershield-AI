"""
Input validation helpers.
"""

MAX_MESSAGE_LENGTH = 2000  # characters


def validate_message(text: str) -> str | None:
    """
    Validate a user-submitted message.
    Returns an error string if invalid, or None if valid.
    """
    if not text:
        return "Message cannot be empty."
    if len(text) > MAX_MESSAGE_LENGTH:
        return f"Message is too long. Maximum {MAX_MESSAGE_LENGTH} characters allowed."
    return None
