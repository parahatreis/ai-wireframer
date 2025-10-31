from ..schemas import GenerateRequest, GenerateResponse
from ..services.generation import generate


def generate_ui_spec(req: GenerateRequest) -> GenerateResponse:
    """
    Controller for UI spec generation using NEW_FLOW pipeline.
    Delegates to service layer for 3-pass generation.
    """
    return generate(req)

