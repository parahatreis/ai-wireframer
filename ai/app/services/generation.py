import os
import json
from typing import List, Dict, Any
from litellm import completion
from ..schemas import GenerateRequest, WireframeResponse
from .html_converter import wireframe_to_html, save_html_file
from .prompts import SYSTEM
from .tools import TOOL_DEFINITIONS, execute_tool, get_tool_prompt


DEFAULT_WEB_VIEWPORT = (1440, 1024)
DEFAULT_MOBILE_VIEWPORT = (390, 844)
MAX_TOOL_ITERATIONS = 10  # Prevent infinite loops

def generate(req: GenerateRequest) -> WireframeResponse:
  """
  Generate wireframe using multi-stage reasoning with tool calls.
  Falls back to single-shot generation if tool calling fails.
  """
  # Use gpt-4o for better reasoning and tool calling
  model = os.getenv("AI_MODEL", "gpt-4o")
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

  try:
    # Try multi-stage generation with tool calling
    return generate_with_tools(req, model, platform_hint, viewport_hint_w, viewport_hint_h)
  except Exception as e:
    print(f"Tool calling failed: {e}. Falling back to single-shot generation.")
    # Fallback to single-shot generation
    return generate_single_shot(req, model, platform_hint, viewport_hint_w, viewport_hint_h)


def generate_with_tools(
  req: GenerateRequest,
  model: str,
  platform_hint: str,
  viewport_hint_w: int,
  viewport_hint_h: int,
) -> WireframeResponse:
  """
  Multi-stage generation using tool calls for layout, theme, motion, and build.
  """
  # Initialize conversation with system message and user prompt
  messages: List[Dict[str, Any]] = []
  
  # Merge with existing conversation history if provided
  if req.messages:
    messages = req.messages.copy()
  else:
    # Start new conversation
    messages = [
      {"role": "system", "content": SYSTEM},
    ]
  
  # Add current user prompt
  user_message = f"Prompt: {req.prompt}. Platform: {platform_hint}, Viewport: {viewport_hint_w}x{viewport_hint_h}"
  messages.append({"role": "user", "content": user_message})
  
  # Context shared across tool calls
  context: Dict[str, Any] = {
    "platform": platform_hint,
    "viewport": f"{viewport_hint_w}x{viewport_hint_h}",
    "prompt": req.prompt,
  }
  
  # Multi-turn conversation loop
  iteration = 0
  final_wireframe = None
  
  while iteration < MAX_TOOL_ITERATIONS:
    iteration += 1
    print(f"Iteration {iteration}: Sending {len(messages)} messages to AI")
    
    # Call AI with tool definitions
    response = completion(
      model=model,
      messages=messages,
      tools=TOOL_DEFINITIONS,
      tool_choice="auto",  # Let AI decide when to use tools
    )
    
    assistant_message = response.choices[0].message
    finish_reason = response.choices[0].finish_reason
    
    print(f"Finish reason: {finish_reason}")
    
    # Add assistant message to conversation
    message_dict = {
      "role": "assistant",
      "content": assistant_message.content,
    }
    
    # Handle tool calls
    if hasattr(assistant_message, "tool_calls") and assistant_message.tool_calls:
      tool_calls_list = []
      for tool_call in assistant_message.tool_calls:
        tool_calls_list.append({
          "id": tool_call.id,
          "type": "function",
          "function": {
            "name": tool_call.function.name,
            "arguments": tool_call.function.arguments,
          }
        })
      message_dict["tool_calls"] = tool_calls_list
      messages.append(message_dict)
      
      # Execute each tool call
      for tool_call in assistant_message.tool_calls:
        tool_name = tool_call.function.name
        tool_args_str = tool_call.function.arguments
        tool_id = tool_call.id
        
        print(f"Executing tool: {tool_name}")
        
        try:
          # Parse tool arguments
          tool_args = json.loads(tool_args_str)
          
          # Execute tool
          tool_result = execute_tool(tool_name, tool_args, context)
          
          # Add tool result to conversation
          messages.append({
            "role": "tool",
            "tool_call_id": tool_id,
            "name": tool_name,
            "content": tool_result,
          })
          
          # Check if this was the final build step
          if tool_name == "build_wireframe":
            result_data = json.loads(tool_result)
            if result_data.get("status") == "success":
              final_wireframe = result_data.get("data")
              print(f"Wireframe build complete! Pages: {len(final_wireframe.get('pages', []))}")
              print(f"Wireframe keys: {final_wireframe.keys()}")
              if not final_wireframe.get("pages"):
                print(f"WARNING: Empty pages array! Tool args keys: {tool_args.keys()}")
                print(f"Wireframe arg: {tool_args.get('wireframe', {}).keys() if isinstance(tool_args.get('wireframe'), dict) else 'not a dict'}")
              break
              
        except Exception as e:
          print(f"Error executing tool {tool_name}: {e}")
          # Add error to conversation
          messages.append({
            "role": "tool",
            "tool_call_id": tool_id,
            "name": tool_name,
            "content": json.dumps({"error": str(e)}),
          })
      
      # If we got the final wireframe, exit loop
      if final_wireframe:
        break
        
    else:
      # No tool calls, add message and check if we're done
      messages.append(message_dict)
      
      if finish_reason == "stop":
        # AI finished without calling build_wireframe, this shouldn't happen
        print("Warning: AI stopped without building wireframe")
        break
  
  # Extract wireframe from context or final_wireframe
  if not final_wireframe:
    final_wireframe = context.get("wireframe")
  
  if not final_wireframe:
    raise ValueError("Failed to generate wireframe through tool calls")
  
  # Validate that we have pages
  if not final_wireframe.get("pages") or len(final_wireframe.get("pages", [])) == 0:
    print("ERROR: Tool-based generation returned empty pages array!")
    print("Falling back to single-shot generation...")
    raise ValueError("Empty pages array from tool calls - falling back")
  
  # Process and validate wireframe
  wireframe_data = process_wireframe_data(final_wireframe, req, platform_hint, viewport_hint_w, viewport_hint_h)
  
  # Add conversation history to response
  wireframe_data["conversation"] = messages
  
  return WireframeResponse(**wireframe_data)


def generate_single_shot(
  req: GenerateRequest,
  model: str,
  platform_hint: str,
  viewport_hint_w: int,
  viewport_hint_h: int,
) -> WireframeResponse:
  """
  Fallback single-shot generation without tool calling.
  """
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
  
  print(f"Raw AI response: {content[:500]}...")
  
  # Try to extract JSON if wrapped in markdown code blocks
  if content.strip().startswith("```"):
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
  
  wireframe_data = process_wireframe_data(data, req, platform_hint, viewport_hint_w, viewport_hint_h)
  return WireframeResponse(**wireframe_data)


def process_wireframe_data(
  data: Dict[str, Any],
  req: GenerateRequest,
  platform_hint: str,
  viewport_hint_w: int,
  viewport_hint_h: int,
) -> Dict[str, Any]:
  """
  Process and normalize wireframe data.
  """
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
  
  return data

