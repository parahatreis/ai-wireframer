"""
Main generation service: orchestrates the full 3-pass pipeline.
1. Normalize prompt
2. Infer app type
3. Pick defaults from design priors
4. Generate seed
5. Pass A → Validate/Repair
6. Pass B → Validate/Repair
7. Pass C (N candidates) → Lint/Score → Repair best if <85
8. Post-process
9. Return { spec, meta }
"""

from typing import Dict, Any
from datetime import datetime, timezone
from ..schemas import GenerateRequest, GenerateResponse, GenerateMeta
from ..utils.design_priors import infer_app_type, infer_platform, get_defaults_for_app_type
from ..utils.seed_generator import generate_seed, seed_for_pass
from ..utils.linter import lint_spec
from ..utils.post_processor import post_process
from .llm_client import LLMClient
from .passes import pass_a_layout, pass_b_content, pass_c_theme


def generate(req: GenerateRequest) -> GenerateResponse:
    """
    Generate UI spec using 3-pass pipeline with validation, scoring, and post-processing.
    
    Args:
        req: Generation request with prompt and options
    
    Returns:
        GenerateResponse with spec and metadata
    
    Raises:
        ValueError: If generation fails at any stage
    """
    print("\n" + "="*60)
    print("Starting NEW_FLOW generation pipeline")
    print("="*60)
    
    # === 1. NORMALIZE PROMPT ===
    prompt = normalize_prompt(req.prompt)
    print(f"\n1. Normalized prompt: {prompt[:100]}...")
    
    # === 2. INFER PLATFORM & APP TYPE ===
    platform = infer_platform(prompt)
    app_type = infer_app_type(prompt)
    print(f"2. Inferred platform: {platform}")
    print(f"3. Inferred app type: {app_type}")
    
    # === 4. PICK DEFAULTS ===
    defaults = get_defaults_for_app_type(app_type)
    print(f"4. Defaults selected: palette={defaults['palette']}, type_scale={defaults['type_scale']}")
    
    # === 5. GENERATE SEED ===
    schema_version = "1.0.0"
    base_seed = generate_seed(prompt, req.options or {}, schema_version)
    
    # Optional: Add variety factor for layout diversity
    # variety=0 (default): deterministic
    # variety=1-3: perturb seed for different layout variations
    variety_factor = (req.options or {}).get("variety", 0)
    if variety_factor > 0:
        base_seed = base_seed + variety_factor
        print(f"5. Generated seed: {base_seed} (with variety={variety_factor})")
    else:
        print(f"5. Generated seed: {base_seed}")
    
    # Initialize LLM clients
    # PRO model for main passes (complex, structured generation)
    llm_client_pro = LLMClient(use_pro=True)
    # LITE model for repairs and simple operations
    llm_client_lite = LLMClient(use_pro=False)
    
    print(f"Using PRO model: {llm_client_pro.model}")
    print(f"Using LITE model: {llm_client_lite.model}")
    
    # === 6. PASS A: LAYOUT ===
    # Use PRO model for complex layout planning
    seed_a = seed_for_pass(base_seed, "pass_a")
    layout_plan = pass_a_layout(
        prompt=prompt,
        seed=seed_a,
        app_type=app_type,
        platform=platform,
        llm_client=llm_client_pro,
    )
    
    # === 7. PASS B: CONTENT ===
    # Use PRO model for content generation
    seed_b = seed_for_pass(base_seed, "pass_b")
    content_plan = pass_b_content(
        layout_plan=layout_plan,
        seed=seed_b,
        llm_client=llm_client_pro,
    )
    
    # === 8. PASS C: THEME (N CANDIDATES) ===
    # Use PRO model for theme generation (most creative pass)
    seed_c = seed_for_pass(base_seed, "pass_c")
    n_candidates = req.options.get("n_candidates", 4) if req.options else 4
    candidates = pass_c_theme(
        content_plan=content_plan,
        base_seed=seed_c,
        llm_client=llm_client_pro,
        n_candidates=n_candidates,
    )
    
    # === 9. LINT & SCORE CANDIDATES ===
    print(f"\n=== Scoring {len(candidates)} Candidates ===")
    scored_candidates = []
    
    for i, candidate in enumerate(candidates):
        spec = candidate.get("spec", {})
        score, violations = lint_spec(spec)
        
        scored_candidates.append({
            "candidate": candidate,
            "score": score,
            "violations": violations,
        })
        
        print(f"Candidate {i + 1}: score={score}/100, palette={candidate.get('palette_name', '?')}")
        if violations:
            print(f"  Violations: {violations[:2]}")  # Show first 2
    
    # Sort by score (highest first)
    scored_candidates.sort(key=lambda x: x["score"], reverse=True)
    
    # Take best candidate
    best = scored_candidates[0]
    best_spec = best["candidate"]["spec"]
    best_score = best["score"]
    best_violations = best["violations"]
    
    print(f"\n✓ Best candidate: score={best_score}/100")
    
    # === 9. REPAIR IF SCORE < 85 ===
    if best_score < 85:
        print(f"Score below 85, attempting targeted repair...")
        print(f"Violations: {best_violations}")
        
        # For now, we'll proceed with the best we have
        # Full repair would require another LLM call with specific fixes
        print("⚠ Proceeding with best available candidate (repair not yet implemented)")
    
    # === 10. POST-PROCESS ===
    final_spec = post_process(best_spec)
    
    # Ensure platform is set in spec.meta
    if "meta" in final_spec:
        final_spec["meta"]["platform"] = platform
    
    # === 11. BUILD METADATA ===
    timestamp = datetime.now(timezone.utc).isoformat()
    
    meta = GenerateMeta(
        schema_version=schema_version,
        seed=base_seed,
        palette_name=best["candidate"].get("palette_name", "slate"),
        type_scale_name=best["candidate"].get("type_scale_name", "modern"),
        spacing_scale_name=best["candidate"].get("spacing_scale_name", "relaxed"),
        linter_score=best_score,
        passes={
            "pass_a": {
                "pages": len(layout_plan.get("pages", [])),
                "nav_items": len(layout_plan.get("nav_items", [])),
            },
            "pass_b": {
                "page_content": len(content_plan.get("page_content", {})),
                "forms": len(content_plan.get("forms", {})),
                "tables": len(content_plan.get("tables", {})),
            },
            "pass_c": {
                "candidates": len(candidates),
                "best_score": best_score,
            },
        },
        timestamp=timestamp,
        app_type=app_type,
    )
    
    print("\n" + "="*60)
    print(f"✓ Generation complete!")
    print(f"  Pages: {len(final_spec.get('pages', []))}")
    print(f"  Score: {best_score}/100")
    print(f"  Palette: {meta.palette_name}")
    print("="*60 + "\n")
    
    return GenerateResponse(
        spec=final_spec,
        meta=meta,
    )


def normalize_prompt(prompt: str) -> str:
    """
    Normalize user prompt: trim, cap length, basic cleanup.
    
    Args:
        prompt: Raw user prompt
    
    Returns:
        Normalized prompt
    """
    # Trim whitespace
    prompt = prompt.strip()
    
    # Cap length (max 2000 chars as per schema)
    if len(prompt) > 2000:
        prompt = prompt[:2000]
    
    # Basic cleanup: collapse multiple spaces
    prompt = " ".join(prompt.split())
    
    # Remove potential PII patterns (very basic)
    # In production, use a proper PII detection library
    # For now, just a simple check
    
    return prompt
