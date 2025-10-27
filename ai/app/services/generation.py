import os
import json
from litellm import completion
from ..schemas import GenerateRequest, WireframeResponse
from .html_converter import wireframe_to_html, save_html_file
from .prompts import SYSTEM


DEFAULT_WEB_VIEWPORT = (1440, 1024)
DEFAULT_MOBILE_VIEWPORT = (390, 844)

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

  # Ensure planned field exists with meaningful default
  if not meta.get("planned") or meta.get("planned") == "":
    prompt_summary = req.prompt[:100] + "..." if len(req.prompt) > 100 else req.prompt
    meta["planned"] = f"Generated a {platform} {meta.get('title', 'wireframe')} based on: {prompt_summary}"
  
  meta["platform"] = platform
  data["meta"] = meta

  wireframe_response = WireframeResponse(**data)
  
  # Convert to HTML and save file
  # html_content = wireframe_to_html(data)
  # html_filepath = save_html_file(html_content, output_dir="html_generations")
  # print(f"HTML file saved to: {html_filepath}")
  
  return wireframe_response

