import re
import bleach

def sanitize_user_input(text: str) -> str:
    """Strip HTML/JS and block common injection phrases."""
    clean = bleach.clean(text, strip=True)
    banned = [r"ignore\s+previous\s+instructions", r"system\s*prompt"]
    for pat in banned:
        if re.search(pat, clean, re.I):
            raise ValueError("Disallowed phrase detected.")
    return clean

def validate_output(text: str) -> None:
    """Simple leak prevention."""
    if "BEGIN PRIVATE KEY" in text or "system prompt" in text.lower():
        raise ValueError("Suspicious model output.")
