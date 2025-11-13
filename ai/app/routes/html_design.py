"""HTML design generation routes"""
from fastapi import APIRouter
from ..schemas import HtmlDesignRequest, HtmlDesignResponse, PageDesign
from ..services.html_design import generate_html_design

router = APIRouter()


@router.post("/generate-html-design", response_model=HtmlDesignResponse)
async def generate_design(req: HtmlDesignRequest):
    """Generate multi-page HTML app design based on prompt with platform detection and conversation history"""
    pages_list, platform, conversation = generate_html_design(
        prompt=req.prompt,
        num_variations=req.num_variations,
        platform=req.platform,
        conversation_history=req.conversation_history
    )
    
    # Convert dict list to PageDesign objects
    pages = [PageDesign(name=p['name'], html=p['html']) for p in pages_list]
    
    return HtmlDesignResponse(
        pages=pages,
        count=len(pages),
        platform=platform,
        conversation=conversation
    )

