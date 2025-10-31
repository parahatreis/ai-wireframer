"""HTML design generation service with parallel variations"""
import os
import re
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


def generate_html_design(
    prompt: str, 
    num_variations: int = 3,
    platform: Optional[str] = None,
    conversation_history: Optional[List[Dict[str, Any]]] = None
) -> Tuple[List[str], str, List[Dict[str, Any]]]:
    """
    Generate HTML design variations based on prompt.
    
    Args:
        prompt: User's design requirements
        num_variations: Number of parallel design variations to generate (default: 3)
        platform: 'mobile' or 'web', auto-detected if None
        conversation_history: Previous conversation for iterations
        
    Returns:
        Tuple of (designs, detected_platform, full_conversation)
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
    
    designs = []
    
    for i in range(num_variations):
        print(f"Generating design variation {i+1}/{num_variations}")
        
        # Create variation prompt
        if conversation_history:
            # This is an iteration/update
            variation_prompt = f"{prompt}\n\nCreate variation #{i+1} based on the previous designs, incorporating the requested changes."
        else:
            # This is a new design
            variation_prompt = f"{prompt}\n\nCreate variation #{i+1} with unique design choices while maintaining high quality."
        
        # Create messages for this variation
        variation_messages = messages.copy()
        variation_messages.append({"role": "user", "content": variation_prompt})
        
        try:
            response = completion(
                model=model,
                messages=variation_messages,
                temperature=0.7 + (i * 0.1),  # Slight variation in creativity
            )
            
            html_content = response.choices[0].message.content
            if html_content:
                # Clean up markdown code blocks if present
                html_content = html_content.strip()
                if html_content.startswith("```html"):
                    html_content = html_content[7:]
                elif html_content.startswith("```"):
                    html_content = html_content[3:]
                if html_content.endswith("```"):
                    html_content = html_content[:-3]
                html_content = html_content.strip()
                
                designs.append(html_content)
            
        except Exception as e:
            print(f"Error generating variation {i+1}: {e}")
            continue
    
    # Build full conversation for next iteration
    full_conversation = messages[1:] if len(messages) > 1 else []  # Exclude system prompt
    full_conversation.append({"role": "user", "content": prompt})
    
    if designs:
        # Add first design as assistant response (as reference for iterations)
        full_conversation.append({
            "role": "assistant", 
            "content": f"I've generated {len(designs)} design variations for your {detected_platform} interface."
        })
    
    return designs, detected_platform, full_conversation

