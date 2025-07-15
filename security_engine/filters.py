import re
from typing import Dict, List, Optional
from security_engine.policy_config import load_policy_config


def analyze_prompt(prompt: str, role: Optional[str] = None) -> Dict:
    """
    Analyze the given prompt using scoring and role-based policy config.
    Returns status, total score, violations list with explanations.
    """
    config = load_policy_config(role)
    prompt = prompt.lower()
    violations = []
    total_score = 0
    effective_role = role or "default"

    # Blocked keywords
    for item in config.get("blocked_keywords", []):
        word = item.get("word")
        score = item.get("score", 10)
        if word and word in prompt:
            violations.append({
                "type": "blocked",
                "word": word,
                "score": score,
                "message": f"The word '{word}' is not allowed for role '{effective_role}'. Please rephrase it."
            })
            total_score += score

    # Risky keywords
    for item in config.get("risky_keywords", []):
        word = item.get("word")
        score = item.get("score", 5)
        if word and word in prompt:
            violations.append({
                "type": "risky",
                "word": word,
                "score": score,
                "message": f"The word '{word}' may be risky in your current role '{effective_role}'. Use with caution."
            })
            total_score += score

    # Blocked patterns
    for item in config.get("blocked_patterns", []):
        pattern = item.get("pattern")
        score = item.get("score", 7)
        if pattern and re.search(pattern, prompt):
            violations.append({
                "type": "regex",
                "pattern": pattern,
                "score": score,
                "message": f"Pattern '{pattern}' is not allowed in role '{effective_role}'. Please avoid using it."
            })
            total_score += score

    if any(v["type"] in ["blocked", "regex"] for v in violations):
        status = "blocked"
    elif any(v["type"] == "risky" for v in violations):
        status = "risky"
    else:
        status = "safe"

    return {
        "status": status,
        "score": total_score,
        "violations": violations
    }


def is_prompt_safe(prompt: str, role: Optional[str] = None) -> bool:
    return analyze_prompt(prompt, role)["status"] == "safe"
