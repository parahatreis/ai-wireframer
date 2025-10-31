"""
Pass A: Layout Plan
- Input: prompt + allowed section kinds + pattern kit names
- Output: pages, routes, ordered sections, grid counts, states
- Settings: temp=0.0, strict schema
- Includes validation and repair
"""

from typing import Dict, Any
from ...utils.prompts import build_pass_a_prompt
from ...utils.validators import validate_pass_a
from ...utils.design_priors import (
    get_all_pattern_names,
    get_defaults_for_app_type,
)
from ...schemas import SectionKind
from ..llm_client import LLMClient


def pass_a_layout(
    prompt: str,
    seed: int,
    app_type: str,
    platform: str,
    llm_client: LLMClient,
) -> Dict[str, Any]:
    """
    Execute Pass A: Generate layout structure.
    
    Args:
        prompt: User's prompt
        seed: Deterministic seed
        app_type: Inferred app type (marketing|dashboard|crud|auth-heavy)
        platform: Target platform (mobile|web)
        llm_client: LLM client instance
    
    Returns:
        Layout plan dict with pages, sections, nav_items, patterns
    
    Raises:
        ValueError: If validation fails after repair attempts
    """
    print(f"=== Pass A: Layout Plan (platform={platform}) ===")
    
    # Get design priors
    allowed_section_kinds = [kind.value for kind in SectionKind]
    pattern_names = get_all_pattern_names()
    defaults = get_defaults_for_app_type(app_type)
    
    # Build system prompt
    system_prompt = build_pass_a_prompt(
        allowed_section_kinds=allowed_section_kinds,
        pattern_names=pattern_names,
        app_type=app_type,
        platform=platform,
    )
    
    # Build user prompt with defaults hint and strong intent clarification
    user_prompt = f"""User prompt: "{prompt}"

Platform: {platform}
App type: {app_type}
Suggested patterns: {defaults['patterns']}

IMPORTANT: This is a {app_type} app.
{'- DO NOT use kind=hero sections (this is NOT a landing page)' if app_type != 'marketing' else '- Use kind=hero for the main section'}
{'- Use kind=list, kind=form, kind=table, kind=card sections' if app_type != 'marketing' else ''}

Generate the layout plan following the schema."""
    
    # Create validator function with app_type bound
    def validator_with_app_type(layout_plan):
        return validate_pass_a(layout_plan, app_type=app_type)
    
    # Generate with validation and repair
    # Higher temperature for more variety (0.3 for layout creativity)
    layout_plan = llm_client.generate_with_repair(
        user_prompt=user_prompt,
        system_prompt=system_prompt,
        validator_fn=validator_with_app_type,
        temperature=0.3,  # Increased for more layout diversity
        seed=seed,
        max_repair_attempts=2,  # More repair attempts to fix hero issues
    )
    
    print(f"✓ Pass A complete: {len(layout_plan.get('pages', []))} pages, {len(layout_plan.get('nav_items', []))} nav items")
    
    return layout_plan

