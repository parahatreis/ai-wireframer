"""
Tool definitions and execution logic for multi-stage design reasoning.
"""

import json
from typing import Dict, Any, List
from .tool_prompts import (
    DISCUSS_LAYOUT_PROMPT,
    DECIDE_THEME_PROMPT,
    CONFIGURE_MOTION_PROMPT,
    BUILD_WIREFRAME_PROMPT,
)

# OpenAI function calling tool definitions
TOOL_DEFINITIONS = [
    {
        "type": "function",
        "function": {
            "name": "discuss_layout",
            "description": "Analyzes requirements and proposes page structure, navigation patterns, and section organization",
            "parameters": {
                "type": "object",
                "properties": {
                    "pages": {
                        "type": "array",
                        "description": "List of pages with their purpose and sections",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "route": {"type": "string"},
                                "purpose": {"type": "string"},
                                "sections": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                },
                                "priority": {"type": "string", "enum": ["high", "medium", "low"]},
                            },
                            "required": ["name", "route", "purpose", "sections"],
                        },
                    },
                    "navigation": {
                        "type": "object",
                        "description": "Navigation structure and items",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": ["horizontal", "bottom-tab", "sidebar", "hamburger"],
                            },
                            "items": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                        "required": ["type", "items"],
                    },
                    "flows": {
                        "type": "array",
                        "description": "Key user flows through the application",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "steps": {
                                    "type": "array",
                                    "items": {"type": "string"},
                                },
                            },
                        },
                    },
                    "reasoning": {
                        "type": "string",
                        "description": "Explanation of layout decisions",
                    },
                },
                "required": ["pages", "navigation", "reasoning"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "decide_theme",
            "description": "Determines color palette, typography, spacing system, and overall visual theme",
            "parameters": {
                "type": "object",
                "properties": {
                    "colors": {
                        "type": "object",
                        "description": "Color palette",
                        "properties": {
                            "primary": {"type": "string"},
                            "secondary": {"type": "string"},
                            "accent": {"type": "string"},
                            "neutral": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                    },
                    "typography": {
                        "type": "object",
                        "description": "Typography system",
                    },
                    "spacing": {
                        "type": "object",
                        "description": "Spacing scale",
                    },
                    "mood": {
                        "type": "string",
                        "description": "Overall mood/personality",
                    },
                    "reasoning": {
                        "type": "string",
                        "description": "Explanation of theme decisions",
                    },
                },
                "required": ["colors", "typography", "spacing", "mood", "reasoning"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "configure_motion",
            "description": "Defines animations, transitions, and micro-interactions for the interface",
            "parameters": {
                "type": "object",
                "properties": {
                    "defaults": {
                        "type": "object",
                        "description": "Default animation settings",
                        "properties": {
                            "duration": {"type": "string"},
                            "easing": {"type": "string"},
                            "properties": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                    },
                    "interactions": {
                        "type": "object",
                        "description": "Interaction animations (hover, press, focus)",
                    },
                    "transitions": {
                        "type": "object",
                        "description": "Page and component transitions",
                    },
                    "reduceMotion": {
                        "type": "object",
                        "description": "Reduced motion accessibility settings",
                    },
                    "reasoning": {
                        "type": "string",
                        "description": "Explanation of motion decisions",
                    },
                },
                "required": ["defaults", "interactions", "reasoning"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "build_wireframe",
            "description": "Generates the complete wireframe JSON based on all previous design decisions",
            "parameters": {
                "type": "object",
                "properties": {
                    "wireframe": {
                        "type": "object",
                        "description": "Complete wireframe following WireframeResponse schema",
                    },
                },
                "required": ["wireframe"],
            },
        },
    },
]


def execute_tool(tool_name: str, tool_args: Dict[str, Any], context: Dict[str, Any]) -> str:
    """
    Execute a tool call and return the result as a JSON string.
    
    Args:
        tool_name: Name of the tool to execute
        tool_args: Arguments passed to the tool
        context: Context from previous tool calls
    
    Returns:
        JSON string result
    """
    if tool_name == "discuss_layout":
        return discuss_layout(tool_args, context)
    elif tool_name == "decide_theme":
        return decide_theme(tool_args, context)
    elif tool_name == "configure_motion":
        return configure_motion(tool_args, context)
    elif tool_name == "build_wireframe":
        return build_wireframe(tool_args, context)
    else:
        return json.dumps({"error": f"Unknown tool: {tool_name}"})


def discuss_layout(args: Dict[str, Any], context: Dict[str, Any]) -> str:
    """
    Process layout decisions and return structured result.
    """
    result = {
        "status": "success",
        "stage": "layout",
        "data": args,
        "summary": f"Proposed {len(args.get('pages', []))} pages with {args.get('navigation', {}).get('type', 'standard')} navigation",
    }
    
    # Store in context for next stages
    context["layout"] = args
    
    return json.dumps(result)


def decide_theme(args: Dict[str, Any], context: Dict[str, Any]) -> str:
    """
    Process theme decisions and return structured result.
    """
    layout = context.get("layout", {})
    
    result = {
        "status": "success",
        "stage": "theme",
        "data": args,
        "summary": f"Defined {args.get('mood', 'neutral')} theme with {args.get('colors', {}).get('primary', 'primary')} color scheme",
        "appliedTo": f"{len(layout.get('pages', []))} pages",
    }
    
    # Store in context for next stages
    context["theme"] = args
    
    return json.dumps(result)


def configure_motion(args: Dict[str, Any], context: Dict[str, Any]) -> str:
    """
    Process motion decisions and return structured result.
    """
    result = {
        "status": "success",
        "stage": "motion",
        "data": args,
        "summary": f"Configured {args.get('defaults', {}).get('duration', '200ms')} animations with {args.get('defaults', {}).get('easing', 'ease-out')} easing",
        "accessibility": "Respects prefers-reduced-motion" if args.get("reduceMotion", {}).get("enabled") else "Standard motion",
    }
    
    # Store in context for final build
    context["motion"] = args
    
    return json.dumps(result)


def build_wireframe(args: Dict[str, Any], context: Dict[str, Any]) -> str:
    """
    Extract and validate the final wireframe.
    """
    wireframe = args.get("wireframe", {})
    
    # Add context summaries to meta
    if "meta" not in wireframe:
        wireframe["meta"] = {}
    
    # Add design stage notes
    layout = context.get("layout", {})
    theme = context.get("theme", {})
    motion = context.get("motion", {})
    
    notes = []
    if layout:
        notes.append(f"Layout: {layout.get('reasoning', 'N/A')}")
    if theme:
        notes.append(f"Theme: {theme.get('reasoning', 'N/A')}")
    if motion:
        notes.append(f"Motion: {motion.get('reasoning', 'N/A')}")
    
    wireframe["meta"]["notes"] = " | ".join(notes) if notes else "Generated wireframe"
    
    result = {
        "status": "success",
        "stage": "build",
        "data": wireframe,
        "summary": f"Built complete wireframe with {len(wireframe.get('pages', []))} pages",
    }
    
    # Store final wireframe in context
    context["wireframe"] = wireframe
    
    return json.dumps(result)


def get_tool_prompt(tool_name: str) -> str:
    """
    Get the detailed prompt for a specific tool.
    """
    prompts = {
        "discuss_layout": DISCUSS_LAYOUT_PROMPT,
        "decide_theme": DECIDE_THEME_PROMPT,
        "configure_motion": CONFIGURE_MOTION_PROMPT,
        "build_wireframe": BUILD_WIREFRAME_PROMPT,
    }
    return prompts.get(tool_name, "")

