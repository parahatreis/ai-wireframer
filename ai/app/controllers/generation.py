from ..schemas import GenerateRequest, WireframeResponse
from ..services.generation import generate


def generate_wireframe(req: GenerateRequest) -> WireframeResponse:
  """
  Controller for wireframe generation.
  Handles request validation and delegates to service layer.
  """
  return generate(req)

