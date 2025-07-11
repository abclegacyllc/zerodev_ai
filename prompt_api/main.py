"""FastAPI service that converts a plain-language prompt into
structured project specs (JSON) using OpenAI Chat Completions."""
from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from openai import AsyncOpenAI

app = FastAPI(title="ZeroDev Prompt Intake API", version="0.1.0")
client = AsyncOpenAI()


class PromptRequest(BaseModel):
    prompt: str = Field(..., example="Build me a Telegram bot that echoes messages.")


class ProjectSpec(BaseModel):
    project_name: str
    description: str
    targets: list[str]


@app.post("/parse", response_model=ProjectSpec)
async def parse_prompt(req: PromptRequest) -> ProjectSpec:  # type: ignore[override]
    try:
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",  # cheaper, adjust as needed
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an assistant that converts software-project requests "
                        "into a JSON spec with keys: project_name, description, targets."
                    ),
                },
                {"role": "user", "content": req.prompt},
            ],
            response_format={
                "type": "json_object",
                "schema": {
                    "project_name": "string",
                    "description": "string",
                    "targets": {"type": "array", "items": "string"},
                },
            },
        )
        # The model returns JSON string → Pydantic will parse
        return ProjectSpec.model_validate_json(completion.choices[0].message.content)  # type: ignore[arg-type]
    except Exception as exc:  # broad catch for MVP
        raise HTTPException(status_code=500, detail=str(exc)) from exc
