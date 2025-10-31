"""
Pass C: Theme Tokens
- Input: Pass B content plan + curated choices
- Output: N themed candidates (keeping A+B identical)
- Settings: temp=0.3-0.4
- Includes candidate generation and validation
"""

import json
from typing import Dict, Any, List
from ...utils.prompts import build_pass_c_prompt
from ...utils.validators import validate_pass_c
from ...utils.design_priors import (
    get_all_palette_names,
    get_all_type_scale_names,
    get_all_spacing_scale_names,
)
from ...utils.seed_generator import seed_for_candidate
from ..llm_client import LLMClient


def pass_c_theme(
    content_plan: Dict[str, Any],
    base_seed: int,
    llm_client: LLMClient,
    n_candidates: int = 4,
) -> List[Dict[str, Any]]:
    """
    Execute Pass C: Generate N themed spec candidates.
    
    Args:
        content_plan: Output from Pass B
        base_seed: Base deterministic seed
        llm_client: LLM client instance
        n_candidates: Number of themed variations to generate
    
    Returns:
        List of themed spec candidates
    
    Raises:
        ValueError: If validation fails for all candidates
    """
    print(f"=== Pass C: Theme Selection ({n_candidates} candidates) ===")
    
    # Get available choices
    available_palettes = get_all_palette_names()
    available_type_scales = get_all_type_scale_names()
    available_spacing_scales = get_all_spacing_scale_names()
    
    candidates = []
    
    for i in range(n_candidates):
        print(f"Generating candidate {i + 1}/{n_candidates}...")
        
        # Generate unique seed for this candidate
        candidate_seed = seed_for_candidate(base_seed, i)
        
        # Build system prompt
        system_prompt = build_pass_c_prompt(
            content_plan=content_plan,
            available_palettes=available_palettes,
            available_type_scales=available_type_scales,
            available_spacing_scales=available_spacing_scales,
            candidate_index=i,
        )
        
        # Build user prompt with the full content plan for fidelity
        forms_map = content_plan.get("forms") or content_plan.get("form_fields", {})
        tables_map = content_plan.get("tables") or content_plan.get("table_columns", {})
        content_plan_json = json.dumps(content_plan, indent=2, sort_keys=True)

        user_prompt = (
            f"Generate themed UI spec candidate #{i + 1}.\n\n"
            "Requirements:\n"
            "- Keep layout, routes, section IDs, and content exactly as provided.\n"
            "- Choose theme tokens (palette/type scale/spacing/radius/shadows) from the allowed lists.\n"
            "- Ensure WCAG AA contrast and return JSON only.\n"
            "- Aim for theme variety versus other candidates.\n\n"
            f"Plan stats:\n"
            f"- Pages: {len(content_plan.get('layout', {}).get('pages', []))}\n"
            f"- Forms: {len(forms_map)}\n"
            f"- Tables: {len(tables_map)}\n\n"
            "Pass B content plan (use verbatim):\n"
            f"{content_plan_json}\n"
        )
        
        # Validator closure
        def validator_fn(output: Dict[str, Any]):
            return validate_pass_c(output, available_palettes)
        
        # Generate with validation and repair
        try:
            themed_spec = llm_client.generate_with_repair(
                user_prompt=user_prompt,
                system_prompt=system_prompt,
                validator_fn=validator_fn,
                temperature=0.35,  # Higher temp for theme variety
                seed=candidate_seed,
                max_repair_attempts=1,
            )
            candidates.append(themed_spec)
            print(f"✓ Candidate {i + 1} complete: {themed_spec.get('palette_name', '?')} palette")
        except ValueError as e:
            print(f"✗ Candidate {i + 1} failed validation: {e}")
            # Continue with other candidates
    
    if not candidates:
        raise ValueError("All theme candidates failed validation")
    
    print(f"✓ Pass C complete: {len(candidates)} valid candidates generated")
    
    return candidates

