"""
Pass B: Content Plan
- Input: Pass A layout plan
- Output: labels, helper text, CTAs, list/table columns, form fields, validation hints
- Settings: temp=0.2
- Includes validation and repair
"""

from typing import Dict, Any
from ...utils.prompts import build_pass_b_prompt
from ...utils.validators import validate_pass_b
from ..llm_client import LLMClient


def pass_b_content(
    layout_plan: Dict[str, Any],
    seed: int,
    llm_client: LLMClient,
) -> Dict[str, Any]:
    """
    Execute Pass B: Add content and copy to layout.
    
    Args:
        layout_plan: Output from Pass A
        seed: Deterministic seed
        llm_client: LLM client instance
    
    Returns:
        Content plan dict with page_content, forms, tables, lists, cta_targets
    
    Raises:
        ValueError: If validation fails after repair attempts
    """
    print("=== Pass B: Content Plan ===")
    
    # Build system prompt
    system_prompt = build_pass_b_prompt(layout_plan)
    
    # Build user prompt
    user_prompt = f"""Based on the layout plan, add all content, labels, and copy.

Layout summary:
- Pages: {len(layout_plan.get('pages', []))}
- Nav items: {layout_plan.get('nav_items', [])}

Generate the complete content plan following the schema."""
    
    # Generate with validation and repair
    content_plan = llm_client.generate_with_repair(
        user_prompt=user_prompt,
        system_prompt=system_prompt,
        validator_fn=validate_pass_b,
        temperature=0.2,  # Slight creativity for content
        seed=seed,
        max_repair_attempts=1,
    )
    
    # Carry forward layout plan
    content_plan["layout"] = layout_plan
    
    print(f"✓ Pass B complete: {len(content_plan.get('page_content', {}))} pages with content")
    
    return content_plan

