# LLM flow for turning a short user prompt into a strict JSON UI spec (for React + Tailwind).

# 1) One service, one endpoint
/generate (POST): { prompt, options? } → { spec, meta }
Tech assumptions (you can swap later): Python app server, one LLM client, in-memory only.

# 2) Your contract (the JSON “UI Spec”)
A versioned schema (small DSL): meta, theme, pages[], sections[], states.
Tight enums only: section.kind ∈ {hero, grid, card, list, form, table, nav, footer, modal}.
Clampable numbers: radius 0–16, cols 1–4, spacing from a small scale.
Return only this JSON (no prose); everything else is metadata.

# 3) Determinism (no surprises)
Seed = hash(prompt + options + schema_version). Use it for:
  - LLM seed parameter (if supported).
  - Any random choices (palette pick, pattern variant).
Temperature: 0.0 for structure, 0.2 for content, 0.3–0.4 for theme sampling.
Schema-locked outputs: use structured outputs / JSON-Schema/grammar decoding with strict:true.

# 4) Zero-DB “design priors” (baked constants)
Ship a few tiny, hard-coded assets inside the Python file:
  - Pattern kit (names only): Hero-Left, Hero-Center, Feature-3up, Stats-4up, List-Detail, Settings-Sections, Auth-Card, Table-With-Filters, Empty-State, Loading-Skeleton.
  - Palette pack (names + 5 tokens each): slate, pine, sky, plum, sand. (Light/dark pairs.)
  - Type scales: modern, dashboard, marketing (predefined text sizes/ratios).
  - Spacing scales: [4,8,12,16,24,32] and [4,8,16,24,32,48].
These are passed to the model as choices (not open-ended values).

# 5) Three-pass pipeline (each pass validated before continuing)
- Pass A — Layout plan (no colors/copy)
  Input: prompt + allowed section.kinds + required pages + pattern kit names.
  Output: pages, routes, ordered sections, rough grid counts, states flags.
  Settings: temp=0.0, strict schema.

  Validate A
  JSON schema check.
  Logical lint:
  Must include nav, main, footer.
  At least 2 pages (e.g., Home + List/Detail).
  Mobile fallback: every grid collapses to 1 column.
  If fail → one repair call with exact violations.

- Pass B — Content (copy & data shapes; still no colors)
  Input: Pass A.
  Output: labels, helper text, CTA targets, list/table columns, form fields + validation hints, page states.
  Settings: temp≈0.2.

  Validate B
  Every interactive has a label.
  Forms include success/error states.
  Tables: ≥3 columns or degrade to list.

- Pass C — Theme tokens (constrained taste)
  Input: Pass B + curated choices.
  Model picks one palette by name, one type scale, one spacing scale, one radius, and fills theme.
  Settings: temp≈0.3–0.4. Ask the model to self-check WCAG AA for primary/foreground but still return JSON only.

# 6) Candidate sampling → score → repair
- Create N themed candidates in Pass C (e.g., N=4), keeping A+B identical.
- Design linter (deterministic, in Python):
  Contrast AA for text/buttons on background.
  Spacing only from chosen scale; no “tight clusters” of >4 dense sections.
  Grid responsiveness: sm:1 / md:2 / lg:3+.
  Type hierarchy: body 16; H1 36–48; sensible ratios.
  Consistency: one radius for cards/buttons; ≤2 shadow styles.
  Landmarks present: header/nav/main/footer.

Take the top score. If <85/100, run one targeted repair (tell the model the exact failures and forbid structural changes).

# 7) Post-processing (automatic cleanups)
- Snap arbitrary gaps to nearest spacing step.
- Nudge palette lightness until contrast passes.
- Deduplicate/merge near-identical sections (e.g., duplicate Feature cards).
- Icon fallback if unknown.

# 8) Output (immutable artifact)
- Return { spec, meta }:
  spec: final JSON UI Spec (strict schema, ready for codegen).
  meta: { schemaVersion, seed, paletteName, typeScaleName, spacingScaleName, linterScore, passes: {A,B,C}, timestamp }.

# 9) Request handling flow (step-by-step)
1. Normalize prompt (trim, cap length, strip PII hints).
2. Infer app type with simple rules (no ML): keywords → marketing | dashboard | CRUD | auth-heavy.
3. Pick defaults from your baked kits (e.g., marketing → Hero-Center, Feature-3up, Stats-4up).
4. Pass A → Validate/Repair (strict).
5. Pass B → Validate/Repair (strict).
6. Pass C (N candidates) → Lint/Score → Repair if needed.
7. Post-process → Return.

# 10) Prompts (structure, not prose)
Each pass uses a short system rubric:
- Always list allowed enums/choices.
- State hard rules (2+ pages, states, landmarks, AA contrast).
- Forbid inventing keys and free-form hex values; only palette names and tokens.