import os
import json
from litellm import completion
from ..schemas import GenerateRequest, WireframeResponse
from .html_converter import wireframe_to_html, save_html_file


DEFAULT_WEB_VIEWPORT = (1440, 1024)
DEFAULT_MOBILE_VIEWPORT = (390, 844)

SYSTEM = """You are an expert UI/UX designer creating beautiful, modern wireframes. Output strictly valid JSON following this schema:

{
  "meta": {
    "title": "string",
    "description": "string",
    "platform": "web|mobile",
    "viewport": "widthxheight",
    "planned": "string" // brief description of the layout plan and structure
  },
  "pages": [
    {
      "name": "string",
      "description": "string (optional)",
      "elements": [
        {
          "type": "header|text|form|button|link|image|container|section|nav|footer|input",
          "content": "string (text content)",
          "styles": {
            "camelCaseProperty": "value"
          },
          "attributes": {
            "id": "string",
            "class": "string",
            "href": "string (for links)",
            "src": "string (for images)",
            "alt": "string (for images)",
            "type": "string (for inputs)",
            "placeholder": "string (for inputs)"
          },
          "elements": [] // nested elements (optional)
        }
      ]
    }
  ]
}

DESIGN PRINCIPLES:
1. Create professional, well-structured layouts with clear visual hierarchy
2. Use proper spacing: generous padding (2rem-3rem) and margins (1.5rem-2rem)
3. Group related elements in containers/sections with appropriate backgrounds
4. Use semantic structure: nav at top, main content in middle, footer at bottom
5. Create balanced, grid-based layouts (2-3 columns for cards/features)
6. Headers should be prominent (2rem-3rem font size)
7. Add descriptive, realistic placeholder text
8. Use proper form structure with labels and logical grouping

STYLING GUIDELINES:
1. Use Tailwind-style spacing: padding/margin values like "2rem", "1.5rem", "3rem"
2. Font sizes: headers (2rem-3rem), subheaders (1.25rem-1.5rem), body (1rem)
3. Add subtle borders: "1px solid rgba(255, 255, 255, 0.1)"
4. Use rounded corners: borderRadius "0.5rem" to "1rem"
5. Proper text colors: use dark text on light backgrounds
6. Add background colors to sections: "rgba(255, 255, 255, 0.05)" for cards
7. Create visual separation with spacing and borders

STRUCTURE RULES:
1. All elements use "type", "content", "styles", "attributes", "elements" structure
2. Forms contain nested input and button elements
3. Inputs: type="input", attributes: {"type": "email|password|text", "placeholder": "..."}
4. Buttons: type="button", attributes: {"type": "submit|button"}
5. Use container/section types to group related elements
6. Use "elements" array for nesting, NOT "fields" or "buttons"
7. Apply margin/padding to create whitespace and visual breathing room

EXAMPLE PATTERNS:
- Hero section: Large header (3rem), descriptive text (1.25rem), CTA button
- Feature cards: 3-column grid, each with icon area, title (1.5rem), description
- Forms: Stacked inputs with labels, spacing between fields, prominent submit button
- Navigation: Horizontal layout with links, padding for spacing
"""

def generate(req: GenerateRequest) -> WireframeResponse:
  model = os.getenv("AI_MODEL", "gpt-4o-mini")
  print(f"Generating wireframe with model: {model}")

  platform_hint = (req.platform or "web").lower()
  if platform_hint not in {"web", "mobile"}:
    platform_hint = "web"

  viewport_hint_w: int
  viewport_hint_h: int
  if req.viewport_w and req.viewport_h:
    viewport_hint_w, viewport_hint_h = req.viewport_w, req.viewport_h
  else:
    defaults = DEFAULT_MOBILE_VIEWPORT if platform_hint == "mobile" else DEFAULT_WEB_VIEWPORT
    viewport_hint_w, viewport_hint_h = defaults

  resp = completion(
    model=model,
    messages=[
      {"role": "system", "content": SYSTEM},
      {
        "role": "user",
        "content": f"Prompt: {req.prompt}. Platform:{platform_hint}, Viewport:{viewport_hint_w}x{viewport_hint_h}",
      },
    ],
    response_format={"type": "json_object"},
  )

  # Extract content from response
  content = resp.choices[0].message.content
  if not content:
    raise ValueError("Empty response from AI model")
  
  print(f"Raw AI response: {content[:500]}...")  # Log first 500 chars
  
  # Try to extract JSON if wrapped in markdown code blocks
  if content.strip().startswith("```"):
    # Remove markdown code block markers
    content = content.strip()
    if content.startswith("```json"):
      content = content[7:]
    elif content.startswith("```"):
      content = content[3:]
    if content.endswith("```"):
      content = content[:-3]
    content = content.strip()
  
  # Parse JSON
  try:
    data = json.loads(content)
  except json.JSONDecodeError as e:
    print(f"JSON parse error: {e}")
    print(f"Content: {content}")
    raise ValueError(f"Invalid JSON response from AI model: {str(e)}")
  
  meta = data.get("meta", {})
  platform = (meta.get("platform") or req.platform or "web").lower()
  if platform not in {"web", "mobile"}:
    platform = "web"

  if "viewport" in meta and isinstance(meta["viewport"], str) and "x" in meta["viewport"]:
    viewport_str = meta["viewport"]
  else:
    defaults = DEFAULT_MOBILE_VIEWPORT if platform == "mobile" else DEFAULT_WEB_VIEWPORT
    viewport_str = f"{req.viewport_w or defaults[0]}x{req.viewport_h or defaults[1]}"
    meta["viewport"] = viewport_str

  meta.setdefault("planned", "")
  meta["platform"] = platform
  data["meta"] = meta

  wireframe_response = WireframeResponse(**data)
  
  # Convert to HTML and save file
  # html_content = wireframe_to_html(data)
  # html_filepath = save_html_file(html_content, output_dir="html_generations")
  # print(f"HTML file saved to: {html_filepath}")
  
  return wireframe_response

