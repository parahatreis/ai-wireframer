"""HTML design generation routes"""
from fastapi import APIRouter
from ..schemas import HtmlDesignRequest, HtmlDesignResponse
from ..services.html_design import generate_html_design

router = APIRouter()


@router.post("/generate-html-design", response_model=HtmlDesignResponse)
async def generate_design(req: HtmlDesignRequest):
    """Generate HTML design variations based on prompt with platform detection and conversation history"""
    designs, platform, conversation = generate_html_design(
        prompt=req.prompt,
        num_variations=req.num_variations,
        platform=req.platform,
        conversation_history=req.conversation_history
    )
    
    return HtmlDesignResponse(
        designs=designs,
        count=len(designs),
        platform=platform,
        conversation=conversation
    )

