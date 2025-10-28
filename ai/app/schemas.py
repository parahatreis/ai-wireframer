from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
  prompt: str
  platform: str | None = "web"
  viewport_w: int | None = 1440
  viewport_h: int | None = 1024
  messages: Optional[List[Dict[str, Any]]] = None  # Conversation history


class WireframeMeta(BaseModel):
  title: str | None = None
  description: str | None = None
  platform: str | None = None
  viewport: str | None = None
  planned: str | None = None


class WireframeResponse(BaseModel):
  meta: WireframeMeta = Field(default_factory=WireframeMeta)
  pages: list = Field(default_factory=list)
  conversation: Optional[List[Dict[str, Any]]] = None  # Full conversation including tool calls

