from fastapi import APIRouter
from ..schemas import GenerateRequest, GenerateResponse
from ..controllers.generation import generate_ui_spec

router = APIRouter()

"""
Generate a UI spec from a prompt using the NEW_FLOW 3-pass pipeline.

Endpoint: POST /generate
Request: GenerateRequest
Example:
{
  "prompt": "Create a dashboard with charts",
  "options": {
    "n_candidates": 4
  }
}

Response: GenerateResponse
Example:
{
  "spec": {
    "version": "1.0.0",
    "meta": { ... },
    "theme": { ... },
    "pages": [ ... ]
  },
  "meta": {
    "schema_version": "1.0.0",
    "seed": 123456789,
    "palette_name": "slate",
    "type_scale_name": "modern",
    "spacing_scale_name": "relaxed",
    "linter_score": 92,
    "passes": { ... },
    "timestamp": "2025-10-31T...",
    "app_type": "dashboard"
  }
}
"""
@router.post("/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    return generate_ui_spec(req)

