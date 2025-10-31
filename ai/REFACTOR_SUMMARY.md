# AI Service Refactor Summary

## Overview
Complete refactoring of the AI service based on NEW_FLOW.md specification. Replaced tool-based generation with a deterministic 3-pass pipeline that produces versioned JSON UI specs.

## What Changed

### Architecture
**Old System:**
- Single monolithic prompt
- Multi-turn tool calling (discuss_layout, decide_theme, configure_motion, build_wireframe)
- Non-deterministic output
- Limited validation
- No scoring system

**New System (NEW_FLOW):**
- 3-pass pipeline: Layout → Content → Theme
- Deterministic seed-based generation
- Hard-coded design priors (zero-DB)
- Validation/repair at each pass
- Design linter with 100-point scoring
- Candidate sampling with automatic selection
- Post-processing cleanups

### New Files Created

```
app/
├── schemas.py                          # NEW: Strict UI Spec schemas with enums
├── services/
│   ├── generation.py                   # REPLACED: Main orchestrator
│   ├── llm_client.py                   # NEW: LiteLLM wrapper with seed support
│   └── passes/
│       ├── __init__.py                 # NEW
│       ├── pass_a_layout.py            # NEW: Layout plan (temp=0.0)
│       ├── pass_b_content.py           # NEW: Content & copy (temp=0.2)
│       └── pass_c_theme.py             # NEW: Theme tokens (temp=0.35)
└── utils/
    ├── __init__.py                     # NEW
    ├── design_priors.py                # NEW: Hard-coded patterns, palettes, scales
    ├── validators.py                   # NEW: Validation for each pass
    ├── linter.py                       # NEW: Design quality scoring
    ├── post_processor.py               # NEW: Automatic cleanups
    ├── seed_generator.py               # NEW: Deterministic seed generation
    └── prompts.py                      # NEW: Structure-focused prompts
```

### Files Removed
- `app/services/tools.py` - Old tool-calling logic
- `app/services/tool_prompts.py` - Old verbose prompts
- `app/services/prompts.py` - Old single system prompt

### Files Modified
- `app/routes/generation.py` - Updated endpoint contract
- `app/controllers/generation.py` - Updated to use new service

## Core Features

### 1. Deterministic Generation
- Seed = hash(prompt + options + schema_version)
- Same input → same output (reproducible)
- Per-pass seeds for controlled randomness

### 2. Design Priors (Zero-DB)
**Pattern Kit:** 10 pre-defined UI patterns
- Hero-Left, Hero-Center, Feature-3up, Stats-4up, List-Detail, Settings-Sections, Auth-Card, Table-With-Filters, Empty-State, Loading-Skeleton

**Palette Pack:** 5 curated color palettes
- slate (professional), pine (natural), sky (tech), plum (creative), sand (warm)
- Each with light/dark mode tokens

**Type Scales:** 3 presets
- modern (16px base, generous whitespace)
- dashboard (14px base, compact)
- marketing (18px base, bold hierarchy)

**Spacing Scales:** 2 options
- compact: [4, 8, 12, 16, 24, 32]
- relaxed: [4, 8, 16, 24, 32, 48]

**App Type Inference:** Keyword matching
- marketing | dashboard | crud | auth-heavy

### 3. Three-Pass Pipeline

**Pass A: Layout (temp=0.0)**
- Input: prompt + allowed section kinds + patterns
- Output: pages, routes, sections, grid configs, states
- Validation: ≥2 pages, nav/main/footer present, mobile fallback
- Repair: One targeted attempt if validation fails

**Pass B: Content (temp=0.2)**
- Input: Pass A layout plan
- Output: labels, CTAs, forms, tables, validation hints
- Validation: Interactives have labels, forms have states, tables ≥3 cols
- Repair: One targeted attempt if validation fails

**Pass C: Theme (temp=0.35)**
- Input: Pass B content + curated choices
- Output: N themed candidates (default 4)
- Constraint: Pick palette/scale by NAME only (no free-form hex)
- Validation: Palette from list, WCAG AA contrast, required keys present

### 4. Design Linter (100-point scoring)
- **Contrast (25 pts):** WCAG AA for text/buttons
- **Spacing (20 pts):** Consistency with chosen scale
- **Grid responsiveness (15 pts):** sm:1 / md:2 / lg:3+
- **Type hierarchy (15 pts):** Body 16, H1 36-48, sensible ratios
- **Consistency (15 pts):** One radius, ≤2 shadows
- **Landmarks (10 pts):** Header/nav/main/footer present

Candidates scored, best selected. If score <85, repair triggered (placeholder for now).

### 5. Post-Processing
- Snap spacing values to nearest scale step
- Nudge colors to pass WCAG AA contrast
- Deduplicate near-identical sections (detection only)
- Replace unknown icon names with fallback

## API Changes

### Request
```json
{
  "prompt": "Create a dashboard with charts",
  "options": {
    "n_candidates": 4
  }
}
```

### Response
```json
{
  "spec": {
    "version": "1.0.0",
    "meta": { "title": "...", "app_type": "dashboard", ... },
    "theme": {
      "palette_name": "slate",
      "colors": { "primary": "#...", ... },
      "typography": { "h1": 48, "body": 16, ... },
      "spacing": { "scale": [4, 8, 16, ...], ... },
      "radius": 8
    },
    "pages": [
      {
        "route": "/",
        "meta": { "title": "Home", ... },
        "sections": [
          { "id": "nav", "kind": "nav", ... },
          { "id": "hero", "kind": "hero", ... }
        ]
      }
    ]
  },
  "meta": {
    "schema_version": "1.0.0",
    "seed": 123456789,
    "palette_name": "slate",
    "type_scale_name": "modern",
    "spacing_scale_name": "relaxed",
    "linter_score": 92,
    "passes": { "pass_a": {...}, "pass_b": {...}, "pass_c": {...} },
    "timestamp": "2025-10-31T...",
    "app_type": "dashboard"
  }
}
```

## Breaking Changes
⚠️ **This is a breaking change for the frontend!**

1. **Response format:** Old `WireframeResponse` → new `{ spec, meta }`
2. **Schema structure:** Element-based → Section kind-based with strict enums
3. **No conversation history:** Single request/response (no multi-turn state)
4. **Options parameter:** New optional dict for configuration

## Testing

To test the new pipeline:

```bash
cd /Users/parahatiljanov/Documents/ai-designer-repo/ai
make dev  # or uvicorn app.main:app --reload

# Test with curl
curl -X POST http://localhost:5566/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "landing page for SaaS app",
    "options": {"n_candidates": 2}
  }'
```

Expected console output:
```
============================================================
Starting NEW_FLOW generation pipeline
============================================================

1. Normalized prompt: landing page for SaaS app...
2. Inferred app type: marketing
3. Defaults selected: palette=sky, type_scale=marketing
4. Generated seed: 1234567890

=== Pass A: Layout Plan ===
✓ Pass A complete: 3 pages, 4 nav items

=== Pass B: Content Plan ===
✓ Pass B complete: 3 pages with content

=== Pass C: Theme Selection (2 candidates) ===
Generating candidate 1/2...
✓ Candidate 1 complete: sky palette
Generating candidate 2/2...
✓ Candidate 2 complete: slate palette
✓ Pass C complete: 2 valid candidates generated

=== Scoring 2 Candidates ===
Candidate 1: score=88/100, palette=sky
Candidate 2: score=85/100, palette=slate

✓ Best candidate: score=88/100

=== Post-Processing ===
✓ Post-processing complete

============================================================
✓ Generation complete!
  Pages: 3
  Score: 88/100
  Palette: sky
============================================================
```

## What's Not Implemented (Future Work)

1. **Full repair logic:** Score <85 triggers placeholder, not actual repair
2. **HTML converter updates:** Old `html_converter.py` needs updating for new schema
3. **Streaming progress:** Pipeline runs synchronously, no streaming updates
4. **Database persistence:** In-memory only (as per NEW_FLOW spec)
5. **Advanced deduplication:** Post-processor detects but doesn't merge sections

## Performance Notes

- **Latency:** 3 LLM calls + N candidates = ~10-15s for 4 candidates
- **Cost:** 4x cost vs single-shot (due to candidate sampling)
- **Determinism:** Same prompt always produces same output (with same seed)

## Configuration

Environment variables (unchanged):
- `AI_MODEL` - Model name (default: "gpt-4o")
- Other LiteLLM config as before

New request options:
- `options.n_candidates` - Number of theme candidates (default: 4)

## Dependencies

No new dependencies added. Uses existing:
- `litellm` - LLM client with seed support
- `pydantic>=2` - Schema validation
- `fastapi` - Web framework

## Next Steps

1. **Update frontend** to handle new response format
2. **Test extensively** with various prompts
3. **Implement repair logic** for score <85 cases
4. **Update HTML converter** for new schema
5. **Add streaming** for progress updates
6. **Tune temperatures** based on real-world results

