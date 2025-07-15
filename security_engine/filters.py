import re
from typing import List, Dict

BLOCKED_KEYWORDS = [
    "ddos", "steal", "exploit", "credit card", "card number", "bypass login", "inject", "malware"
]

RISKY_KEYWORDS = [
    "admin panel", "root access", "disable captcha", "generate fake", "spam bot"
]

BLOCKED_PATTERNS = [
    r"\b\d{16}\b",  # 16-digit numbers (credit card)
    r"(?i)password\s*=\s*['\"]?.+['\"]?"  # password=...
]


def analyze_prompt(prompt: str) -> Dict:
    """
    Analyze prompt and return structured result with violations list.
    """
    prompt = prompt.lower()
    violations = []

    for kw in BLOCKED_KEYWORDS:
        if kw in prompt:
            violations.append({"type": "blocked", "keyword": kw})

    for kw in RISKY_KEYWORDS:
        if kw in prompt:
            violations.append({"type": "risky", "keyword": kw})

    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, prompt):
            violations.append({"type": "regex", "pattern": pattern})

    if any(v["type"] == "blocked" for v in violations):
        status = "blocked"
    elif any(v["type"] == "risky" for v in violations):
        status = "risky"
    else:
        status = "safe"

    return {
        "status": status,
        "violations": violations
    }


def is_prompt_safe(prompt: str) -> bool:
    return analyze_prompt(prompt)["status"] == "safe"
