"""HTML design generation service with multi-page app generation"""
import os
import re
import json
from typing import List, Optional, Dict, Any, Tuple
from litellm import completion
from .html_design_prompt import get_design_system_prompt


def detect_platform(prompt: str) -> str:
    """
    Detect platform (mobile or web) from user prompt.
    
    Args:
        prompt: User's design requirements
        
    Returns:
        'mobile' or 'web'
    """
    prompt_lower = prompt.lower()
    
    # Mobile keywords
    mobile_keywords = [
        r'\bmobile\b', r'\bapp\b', r'\bios\b', r'\bandroid\b',
        r'\bphone\b', r'\biphone\b', r'\bsmartphone\b',
        r'\bmobile.?app\b', r'\bmobile.?ui\b'
    ]
    
    # Web keywords
    web_keywords = [
        r'\bweb\b', r'\bwebsite\b', r'\bdesktop\b', r'\blanding.?page\b',
        r'\bdashboard\b', r'\bweb.?app\b', r'\bweb.?page\b', r'\bsite\b'
    ]
    
    mobile_score = sum(1 for keyword in mobile_keywords if re.search(keyword, prompt_lower))
    web_score = sum(1 for keyword in web_keywords if re.search(keyword, prompt_lower))
    
    # Default to web if unclear
    return 'mobile' if mobile_score > web_score else 'web'


def extract_design_summary(first_page_html: str, platform: str) -> str:
    """
    Extract a concise design summary from the first page for LLM memory.
    
    Args:
        first_page_html: HTML content of the first page
        platform: 'mobile' or 'web'
        
    Returns:
        Concise summary of design features
    """
    model = os.getenv("AI_MODEL", "gpt-4o")
    
    summary_prompt = f"""Analyze this {platform} design and provide a brief summary of key design features.

HTML to analyze (first 2000 chars):
{first_page_html[:2000]}

Provide a concise summary (max 150 words) including:
- Color palette and theme
- Typography choices
- Layout approach
- Key UI components and style
- Overall design aesthetic

Format as a brief paragraph."""
    
    try:
        response = completion(
            model=model,
            messages=[
                {"role": "user", "content": summary_prompt}
            ],
            temperature=0.3,
        )
        
        summary = response.choices[0].message.content.strip()
        return summary
    except Exception as e:
        print(f"Error extracting design summary: {e}")
        return f"Design features a {platform} interface with modern styling and user-friendly layout."


def generate_html_design(
    prompt: str, 
    num_variations: int = 3,
    platform: Optional[str] = None,
    conversation_history: Optional[List[Dict[str, Any]]] = None
) -> Tuple[List[Dict[str, str]], str, List[Dict[str, Any]]]:
    """
    Generate multi-page HTML app design based on prompt.
    
    Args:
        prompt: User's design requirements
        num_variations: Number of pages to generate (default: 3)
        platform: 'mobile' or 'web', auto-detected if None
        conversation_history: Previous conversation for iterations
        
    Returns:
        Tuple of (pages_list, detected_platform, full_conversation)
        where pages_list is [{"name": "Home", "html": "..."}, ...]
    """
    model = os.getenv("AI_MODEL", "gpt-4o")
    
    # Detect platform if not provided
    detected_platform = platform if platform in ['mobile', 'web'] else detect_platform(prompt)
    print(f"Platform detected: {detected_platform}")
    
    # Get platform-specific system prompt
    system_prompt = get_design_system_prompt(detected_platform)
    
    # Build conversation messages
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history if provided (for iterations)
    if conversation_history:
        messages.extend(conversation_history)
    
    # Add user prompt
    if conversation_history:
        user_prompt = f"{prompt}\n\nUpdate the previous design based on these requirements. Return the full JSON object with all pages (with modifications applied)."
    else:
        user_prompt = f"{prompt}\n\nGenerate {num_variations} distinct pages for this {detected_platform} app. Return a JSON object as specified in the output format."
    
    messages.append({"role": "user", "content": user_prompt})
    
    print(f"Generating {num_variations} pages for {detected_platform} app")
    
    try:
        response = completion(
            model=model,
            messages=messages,
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON response
        try:
            response_data = json.loads(content)
            
            # Extract pages array from response
            pages_data = None
            if isinstance(response_data, dict):
                if 'pages' in response_data:
                    pages_data = response_data['pages']
                elif 'designs' in response_data:
                    pages_data = response_data['designs']
                else:
                    # Take the first array value
                    for value in response_data.values():
                        if isinstance(value, list):
                            pages_data = value
                            break
            elif isinstance(response_data, list):
                # Direct array response
                pages_data = response_data
            
            if not pages_data or not isinstance(pages_data, list):
                print(f"Invalid response structure: {type(response_data)}")
                print(f"Response keys: {response_data.keys() if isinstance(response_data, dict) else 'not a dict'}")
                raise ValueError("Response does not contain a valid pages array")
            
            pages = []
            for page_data in pages_data:
                if isinstance(page_data, dict) and 'name' in page_data and 'html' in page_data:
                    pages.append({
                        "name": page_data['name'],
                        "html": page_data['html'].strip()
                    })
            
            if not pages:
                raise ValueError("No valid pages found in response")
            
            print(f"Successfully generated {len(pages)} pages")
            
        except json.JSONDecodeError as e:
            print(f"JSON parse error: {e}")
            # Fallback: try to extract from markdown code blocks
            pages = []
            print("Response was not valid JSON, attempting fallback parsing")
            
    except Exception as e:
        print(f"Error generating designs: {e}")
        pages = []
    
    # If no pages generated, return empty
    if not pages:
        print("No pages generated, returning empty list")
        full_conversation = messages[1:] if len(messages) > 1 else []
        full_conversation.append({"role": "user", "content": prompt})
        return [], detected_platform, full_conversation
    
    # Extract design summary for memory
    design_summary = extract_design_summary(pages[0]['html'], detected_platform)
    
    # Build full conversation for next iteration
    full_conversation = messages[1:] if len(messages) > 1 else []  # Exclude system prompt
    full_conversation.append({"role": "user", "content": prompt})
    
    # Add design summary as assistant response (for LLM memory)
    page_names = ", ".join([p['name'] for p in pages])
    full_conversation.append({
        "role": "assistant", 
        "content": f"I've generated {len(pages)} pages for your {detected_platform} app: {page_names}.\n\nDesign Summary:\n{design_summary}"
    })
    
    return pages, detected_platform, full_conversation

