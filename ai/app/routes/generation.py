from fastapi import APIRouter
from ..schemas import GenerateRequest, WireframeResponse
from ..controllers.generation import generate_wireframe

router = APIRouter()

"""
Generate a wireframe from a prompt.

Endpoint: POST /generate
Request: GenerateRequest
Example:
{
  "prompt": "Create a dashboard with charts",
  "platform": "web",
  "viewport_w": 1920,
  "viewport_h": 1080
}
Response: WireframeResponse
Example:
{
  "meta": {
    "prompt": "Create a dashboard with charts",
    "platform": "web",
    "viewport_w": 1920,
    "viewport_h": 1080
  },
  "pages": [
  ]
}
"""
@router.post("/generate", response_model=WireframeResponse)
def generate(req: GenerateRequest):
  return generate_wireframe(req)

