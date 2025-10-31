"""
System prompts for the 3-pass pipeline.
Structure-focused, not prose. Lists constraints, forbids free-form values.
"""

from typing import List, Dict, Any


def build_pass_a_prompt(
    allowed_section_kinds: List[str],
    pattern_names: List[str],
    app_type: str,
    platform: str,
) -> str:
    """
    Build Pass A system prompt: Layout plan (no colors/content).
    Temperature: 0.0, strict schema.
    """
    section_kinds_str = ", ".join(allowed_section_kinds)
    patterns_str = ", ".join(pattern_names)
    
    # Platform-specific constraints
    if platform == "mobile":
        platform_notes = """
- MOBILE: Intent-first design
  * DEFAULT: Most mobile apps are FUNCTIONAL (todo, chat, tracker, tools)
  * Functional apps → kind=list, kind=form, kind=card (NO hero)
  * Marketing pages (rare) → kind=hero ONLY if explicitly "landing page"
- Functional apps (most common):
  * Todo/task: kind=list for items, kind=form for adding new
  * Chat: kind=list for messages, kind=form for input
  * Trackers: kind=card or kind=list for data, kind=form for entry
  * Single page OK for simple apps (calculator, timer)
  * Nav is GLOBAL: Add kind=nav once (typically on first page), not on every page
- Landing pages (rare on mobile):
  * ONLY use hero if prompt explicitly says "landing page" or "marketing"
  * If unclear, assume functional app
- Mobile grids: ALWAYS 1 column
- Navigation: Bottom tab bar (kind=nav) for multi-page apps
"""
    else:
        platform_notes = """
- WEB: Intent-first design
  * Functional apps: kind=nav, kind=list, kind=table, kind=form (NO hero)
  * Marketing pages: kind=hero, kind=grid, kind=footer
  * If unclear, check for functional keywords (todo, chat, dashboard, tracker)
- Functional apps (dashboard, tools, apps):
  * Nav is GLOBAL: Add kind=nav once (typically first section of first page)
  * Use list, table, form sections for functionality
  * Use card or grid for dashboards
  * NO hero sections for functional apps
  * Other pages don't need nav repeated
- Marketing/landing pages:
  * ONLY use kind=hero if explicitly "landing page" or "marketing"
  * Start with kind=hero
  * Use 2-4 column grids for features
  * Include kind=footer
- Grids: Use 2-4 columns as appropriate
- Layout: Horizontal layouts, wider spacing
"""
    
    return f"""You are a UI architect creating a layout plan. Output JSON only, no prose.

# Task
Generate a layout structure with pages, routes, and sections. NO colors, NO content yet.

# Target Platform
{platform.upper()} - {platform_notes}

# Constraints
- App type inferred: {app_type}
- Section kinds ONLY: {section_kinds_str}
- Available patterns: {patterns_str}
- Include state flags: empty, loading, error where relevant

# Output Schema
{{
  "pages": [
    {{
      "route": "/path",
      "title": "Page Name",
      "description": "Purpose",
      "sections": [
        {{
          "kind": "{allowed_section_kinds[0]}",
          "id": "unique-id",
          "pattern": "pattern-name-from-list or null",
          "grid_cols": 1-4,
          "has_empty_state": true/false,
          "has_loading_state": true/false,
          "has_error_state": true/false
        }}
      ]
    }}
  ],
  "nav_items": ["Home", "Page2", "..."],
  "required_patterns": ["patterns used"],
  "notes": "Brief reasoning"
}}

# CRITICAL RULES
1. Use ONLY section kinds from the allowed list
2. SECTION KIND SELECTION (READ CAREFULLY):
   
   FUNCTIONAL APPS → NEVER use kind=hero
   - Todo, task, tracker, organizer → kind=list, kind=form
   - Chat, messaging → kind=list, kind=form
   - Dashboard, analytics → kind=card, kind=grid, kind=table
   - Any app with "app", "tool", "system" → kind=list, kind=form, kind=table
   - "mobile todo app" → kind=list, kind=form (NOT hero)
   - "chat app" → kind=list, kind=form (NOT hero)
   
   MARKETING PAGES → Use kind=hero
   - ONLY if prompt explicitly says "landing page" or "marketing site"
   - If unclear, assume functional app (NO hero)
   
3. ADD VARIETY:
   - Vary section ordering, patterns, and structure
   - Multiple valid solutions exist - explore them
   - Don't repeat the same layout every time
   
4. Technical constraints:
   - Grid cols: 1-4 (mobile: always 1)
   - Add empty/loading/error states for lists, tables
   - Nav is global (once per app, not per page)

Return valid JSON now."""


def build_pass_b_prompt(
    layout_plan: Dict[str, Any],
) -> str:
    """
    Build Pass B system prompt: Content & copy (no colors yet).
    Temperature: 0.2.
    """
    pages_summary = ", ".join([p.get("route", "?") for p in layout_plan.get("pages", [])])
    
    return f"""You are a content designer. Add labels, copy, CTAs, and data structures. Output JSON only.

# Task
Fill in content for the layout plan. NO theme/colors yet.

# Layout Context
Pages: {pages_summary}
Nav items: {layout_plan.get("nav_items", [])}

# Constraints
- Every interactive element NEEDS a label
- Forms MUST have success/error state messages
- Tables MUST have ≥3 columns OR degrade to list
- CTAs: realistic, action-oriented text
- Field validation hints where appropriate
- Helpful placeholder text

# Output Schema
{{
  "page_content": {{
    "/route": {{
      "hero_headline": "text",
      "hero_description": "text",
      "cta_primary": "Get Started",
      "cta_secondary": "Learn More",
      "section_labels": {{"section-id": "label"}},
      "states": {{
        "empty": "No items yet. Create your first one.",
        "loading": "Loading...",
        "error": "Failed to load. Try again."
      }}
    }}
  }},
  "forms": {{
    "form-id": {{
      "fields": [
        {{
          "name": "email",
          "label": "Email Address",
          "type": "email",
          "placeholder": "you@example.com",
          "required": true,
          "validation": "email",
          "helper": "We'll never share your email"
        }}
      ],
      "submit_label": "Sign Up",
      "success_message": "Account created!",
      "error_message": "Please check your inputs"
    }}
  }},
  "tables": {{
    "table-id": {{
      "columns": [
        {{"key": "name", "label": "Name", "type": "text", "sortable": true}},
        {{"key": "status", "label": "Status", "type": "badge"}},
        {{"key": "actions", "label": "", "type": "action"}}
      ]
    }}
  }},
  "lists": {{
    "list-id": {{
      "item_template": {{
        "title": "Item Title",
        "description": "Description",
        "cta": "View Details"
      }}
    }}
  }},
  "cta_targets": {{
    "Get Started": "/signup",
    "Learn More": "#features"
  }},
  "notes": "Content decisions"
}}

# Rules
1. All forms: ≥1 field, submit button, success/error messages
2. All tables: ≥3 columns or convert to list
3. All buttons/links: clear labels (no "Click here")
4. Empty states: encouraging, actionable
5. Validation: realistic patterns (email, phone, etc)

Return valid JSON now."""


def build_pass_c_prompt(
    content_plan: Dict[str, Any],
    available_palettes: List[str],
    available_type_scales: List[str],
    available_spacing_scales: List[str],
    candidate_index: int = 0,
) -> str:
    """
    Build Pass C system prompt: Theme tokens (constrained taste).
    Temperature: 0.3-0.4, candidate sampling.
    """
    palettes_str = ", ".join(available_palettes)
    type_scales_str = ", ".join(available_type_scales)
    spacing_scales_str = ", ".join(available_spacing_scales)

    layout = content_plan.get("layout", {})
    pages = layout.get("pages", [])

    page_summaries: List[str] = []
    for page in pages:
        route = page.get("route", "?")
        section_kinds = ", ".join(
            section.get("kind", "?") for section in page.get("sections", [])
        ) or "no sections"
        page_summaries.append(f"{route}: {section_kinds}")

    layout_summary = "; ".join(page_summaries) if page_summaries else "(no pages provided)"
    nav_items = layout.get("nav_items", [])

    app_type_hint = layout.get("app_type") or content_plan.get("app_type") or "unknown"
    platform_hint = layout.get("platform") or content_plan.get("platform") or "web|mobile"

    return f"""You are a design system architect. Choose theme tokens from curated options. Output JSON only.

# Task
Combine the provided layout + content plan with one palette, one type scale, one spacing scale, and one radius to produce a complete UI spec.

# Available Choices
Palettes: {palettes_str}
Type scales: {type_scales_str}
Spacing scales: {spacing_scales_str}
Radius: 0-16 (multiples of 2 or 4)

# Layout Snapshot
- App type hint: {app_type_hint}
- Platform hint: {platform_hint}
- Routes & sections: {layout_summary}
- Nav items: {nav_items}

# Constraints
- Keep layout/page structure exactly as provided (no new pages, sections, or ID changes).
- Use palette/type scale/spacing scale names only; colors must come from the chosen palette.
- Typography and spacing values must match the chosen type scale and spacing scale definitions.
- Radius consistent (0-16, multiples of 2 or 4). Shadows ≤2 styles.
- Check WCAG AA contrast for primary + foreground on background.
- Do not invent new keys or remove required fields.

# Candidate Variation
This is candidate #{candidate_index + 1}. Make theme choices distinct from other candidates while keeping layout/content identical.

# Output Contract
- Return JSON with keys: spec, palette_name, type_scale_name, spacing_scale_name, contrast_check, notes.
- spec.version = "1.0.0".
- spec.meta.title/description/app_type/platform should reuse layout metadata or obvious context.
- spec.theme must mirror the chosen names and include colors, typography, spacing, radius, shadows from design priors.
- spec.pages must exactly mirror the provided layout (order, routes, meta, section ids/kinds). Fill titles, descriptions, content, forms, tables, and states using the content plan.
- spec.states: include global states if provided; else {{}}.
- contrast_check: "AA pass" or "AA fail: <reason>".
- notes: one-sentence theme rationale.

# Final Rules
1. Do not add/remove pages, sections, or keys.
2. Do not invent palettes/colors/typography outside curated sets.
3. Keep palette/type/spacing names aligned between spec.theme and top-level fields.
4. Return JSON only.

Return valid JSON now."""


def build_repair_prompt_additions() -> str:
    """Additional instructions for repair prompts"""
    return """
REPAIR MODE: Fix ONLY the listed violations. Do NOT change structure otherwise.
"""

