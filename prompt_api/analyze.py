from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from security_engine.filters import analyze_prompt
from security_engine.audit_log import log_violation
import time
import random

router = APIRouter()


class AnalyzePromptRequest(BaseModel):
    prompt: str
    role: Optional[str] = "guest"
    user_id: Optional[str] = "anonymous"


# Dummy helper: tag classifier (can be replaced by AI model later)
def classify_prompt_type(prompt: str) -> str:
    prompt = prompt.lower()
    if "bot" in prompt:
        return "bot"
    elif "dashboard" in prompt or "web" in prompt:
        return "web_tool"
    elif "payment" in prompt or "credit card" in prompt:
        return "finance"
    elif "game" in prompt:
        return "game"
    return "general"


# Dummy suggestions (can be AI-generated in future)
def get_suggestions(word: str) -> list:
    suggestions_dict = {
        "phishing": ["email auth flow", "secure login bot"],
        "bypass login": ["add forgot-password link", "admin verification"],
        "ddos": ["traffic load balancer", "rate limiting tool"],
        "inject": ["input sanitizer", "validation module"]
    }
    return suggestions_dict.get(word, [])


def get_severity(score: int) -> str:
    if score >= 15:
        return "high"
    elif score >= 7:
        return "medium"
    return "low"


@router.post("/analyze", tags=["Prompt Filter"])
def analyze_prompt_route(data: AnalyzePromptRequest):
    start = time.time()

    result = analyze_prompt(data.prompt, role=data.role)

    # Add suggestions and severity to each violation
    for v in result["violations"]:
        v["suggestions"] = get_suggestions(v.get("word") or v.get("pattern"))

    # Optional logging if not safe
    if result["status"] != "safe":
        log_violation(data.prompt, result, user_id=data.user_id)

    # Extend result with UX fields
    enriched_result = {
        "status": result["status"],
        "score": result["score"],
        "severity": get_severity(result["score"]),
        "violations": result["violations"],
        "prompt_type": classify_prompt_type(data.prompt),
        "eval_time_ms": int((time.time() - start) * 1000)
    }

    return enriched_result
