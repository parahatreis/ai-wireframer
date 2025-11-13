from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class HtmlDesignRequest(BaseModel):
  prompt: str
  num_variations: int = 3
  platform: Optional[str] = None  # 'mobile' or 'web', auto-detected if None
  conversation_history: Optional[List[Dict[str, Any]]] = None  # For iterations


class PageDesign(BaseModel):
  name: str  # "Home", "Detail", "Settings", etc.
  html: str  # Complete HTML for this page


class HtmlDesignResponse(BaseModel):
  pages: List[PageDesign]  # List of page designs
  count: int
  platform: str  # Detected or provided platform
  conversation: List[Dict[str, Any]]  # Full conversation including current exchange

