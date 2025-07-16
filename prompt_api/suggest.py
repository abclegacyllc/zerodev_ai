from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from openai import OpenAI
import hashlib

router = APIRouter()
ai = OpenAI()


class SuggestPromptRequest(BaseModel):
    prompt: str
    role: Optional[str] = "guest"
    user_id: Optional[str] = "anonymous"


def get_confidence_score(original: str, suggestion: str) -> float:
    """
    Dummy scoring based on string similarity. Real version may use AI eval later.
    """
    original = original.lower().strip()
    suggestion = suggestion.lower().strip()
    shared = set(original.split()) & set(suggestion.split())
    score = len(shared) / max(len(original.split()), 1)
    return round(min(score + 0.2, 0.99), 2)


@router.post("/suggest_prompt", tags=["AI Suggestions"])
def suggest_prompt_route(data: SuggestPromptRequest):
    system_msg = (
        "You are a smart AI assistant. "
        "When given an unsafe or unethical software prompt, rewrite it into a safe, ethical, and developer-friendly version. "
        "Return 3 variants, clearly separated by newlines."
    )

    user_msg = f"Rewrite this software prompt in 3 safe and ethical ways:\n{data.prompt}"

    response = ai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg}
        ],
        temperature=0.4
    )

    raw_output = response.choices[0].message.content.strip()

    # Split response by line or bullet format
    variants = [line.strip("•- ") for line in raw_output.split("\n") if line.strip()]
    top_3 = variants[:3] if len(variants) >= 3 else variants

    results = []
    for suggestion in top_3:
        score = get_confidence_score(data.prompt, suggestion)
        results.append({
            "suggested_prompt": suggestion,
            "confidence": score
        })

    return {
        "original_prompt": data.prompt,
        "role": data.role,
        "suggestions": results
    }
