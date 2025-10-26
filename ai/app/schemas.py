from pydantic import BaseModel, Field


class GenerateRequest(BaseModel):
  prompt: str
  platform: str | None = "web"
  viewport_w: int | None = 1440
  viewport_h: int | None = 1024


class WireframeResponse(BaseModel):
  meta: dict = Field(default_factory=dict)
  pages: list = Field(default_factory=list)

