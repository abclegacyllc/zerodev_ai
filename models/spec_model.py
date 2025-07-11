"""Shared project spec model used by Prompt API and CodeGen Agent."""
from __future__ import annotations

from pydantic import BaseModel, Field
from typing import List

class ProjectSpec(BaseModel):
    project_name: str = Field(..., example="telegram_echo_bot")
    description: str = Field(..., example="A Telegram bot that echoes user messages")
    language: str = Field(..., example="python")
    targets: List[str] = Field(..., example=["telegram bot", "echo feature", "test file"])

    class Config:
        extra = "ignore"
        populate_by_name = True
