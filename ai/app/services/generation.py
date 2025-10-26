import os
import json
from litellm import completion
from ..schemas import GenerateRequest, WireframeResponse
from .html_converter import wireframe_to_html, save_html_file

SYSTEM = """You output strictly valid JSON for a low-fi wireframe following this exact schema:

{
  "meta": {
    "title": "string",
    "description": "string",
    "platform": "web|mobile",
    "viewport": "widthxheight"
  },
  "pages": [
    {
      "name": "string",
      "description": "string (optional)",
      "elements": [
        {
          "type": "header|text|form|button|link|image|container|section|nav|footer",
          "content": "string (text content)",
          "styles": {
            "camelCaseProperty": "value"
          },
          "attributes": {
            "id": "string",
            "class": "string",
            "href": "string (for links)",
            "src": "string (for images)",
            "alt": "string (for images)"
          },
          "elements": [] // nested elements (optional)
        }
      ]
    }
  ]
}

RULES:
1. All elements use "type", "content", "styles", "attributes", "elements" structure
2. Forms contain nested elements (inputs, buttons)
3. Inputs use type="input" with attributes: {"type": "email|password|text", "placeholder": "..."}
4. Buttons use type="button" with attributes: {"type": "submit|button"}
5. Links use type="link" with attributes: {"href": "url"}
6. Use "elements" array for nesting, NOT "fields" or "buttons"
7. All styles in camelCase inside "styles" object
8. Keep structure flat and consistent
"""

def generate(req: GenerateRequest) -> WireframeResponse:
  model = os.getenv("AI_MODEL", "gpt-4o-mini")
  print(f"Generating wireframe with model: {model}")
  resp = completion(
    model=model,
    messages=[
      {"role": "system", "content": SYSTEM},
      {
        "role": "user",
        "content": f"Prompt: {req.prompt}. Platform:{req.platform}, Viewport:{req.viewport_w}x{req.viewport_h}",
      },
    ],
  )

  # Assume resp.choices[0].message.content is JSON string:
  data = json.loads(resp.choices[0].message["content"])
  wireframe_response = WireframeResponse(**data)
  
  # Convert to HTML and save file
  html_content = wireframe_to_html(data)
  html_filepath = save_html_file(html_content, output_dir="html_generations")
  print(f"HTML file saved to: {html_filepath}")
  
  return wireframe_response

