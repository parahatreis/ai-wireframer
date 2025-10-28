"""
Tool-specific prompts for multi-stage design reasoning.
Each tool guides the AI through a specific design stage.
"""

DISCUSS_LAYOUT_PROMPT = """
You are analyzing the user's requirements to determine the optimal page structure and layout.

Focus on:
- Information architecture: What pages are needed? What's their hierarchy?
- Navigation patterns: How do users move between pages?
- Page sections: What sections should each page have (header, hero, content, footer)?
- Content flow: What's the logical order of information?
- User flows: What are the key user journeys?

Consider:
- Platform (web vs mobile) affects navigation patterns
- Multi-page vs single-page applications
- Common patterns: landing pages, dashboards, list-detail, forms, auth flows
- Empty states, loading states, error states

Return a JSON object with:
{
  "pages": [
    {
      "name": "Page Name",
      "route": "/route",
      "purpose": "What this page does",
      "sections": ["header", "hero", "content", "footer"],
      "priority": "high|medium|low"
    }
  ],
  "navigation": {
    "type": "horizontal|bottom-tab|sidebar|hamburger",
    "items": ["Home", "Products", "About"]
  },
  "flows": [
    {
      "name": "Primary flow",
      "steps": ["Page A → Page B → Complete"]
    }
  ],
  "reasoning": "Why this structure makes sense"
}
"""

DECIDE_THEME_PROMPT = """
You are deciding on the visual theme based on the brand, mood, and layout context.

Focus on:
- Color palette: Primary, secondary, accent, neutral colors
- Typography: Font families, sizes, weights, line heights
- Spacing system: Consistent padding, margin, gap values
- Brand personality: Professional, playful, minimal, bold, etc.
- Accessibility: Contrast ratios, readability

Consider:
- Platform conventions (iOS vs web vs Android)
- Target audience and industry
- Existing brand guidelines if mentioned
- Dark mode compatibility
- Color psychology and emotional impact

Return a JSON object with:
{
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "neutral": ["#hex1", "#hex2", "#hex3"],
    "semantic": {
      "success": "#hex",
      "warning": "#hex",
      "error": "#hex",
      "info": "#hex"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "Font Name",
      "body": "Font Name"
    },
    "scale": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "24px",
      "2xl": "32px",
      "3xl": "48px"
    },
    "weights": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },
  "spacing": {
    "unit": "4px",
    "scale": [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  },
  "borders": {
    "radius": {
      "sm": "4px",
      "md": "8px",
      "lg": "12px",
      "xl": "16px",
      "full": "9999px"
    },
    "width": {
      "thin": "1px",
      "medium": "2px",
      "thick": "4px"
    }
  },
  "mood": "professional|playful|minimal|bold|elegant",
  "reasoning": "Why this theme fits the requirements"
}
"""

CONFIGURE_MOTION_PROMPT = """
You are configuring animations and micro-interactions for the interface.

Focus on:
- Transitions: Duration, easing, properties to animate
- Hover effects: Subtle feedback for interactive elements
- Loading states: Skeletons, spinners, progress indicators
- Page transitions: How pages/views change
- Micro-interactions: Button clicks, form focus, tooltips
- Performance: Use transform/opacity, avoid layout thrashing
- Accessibility: Respect prefers-reduced-motion

Consider:
- Platform conventions (iOS spring animations, material motion)
- Purpose of each animation (feedback, attention, hierarchy)
- Animation budgets (keep under 300ms for most interactions)
- Progressive enhancement
- Battery and performance impact

Return a JSON object with:
{
  "defaults": {
    "duration": "200ms",
    "easing": "ease-out",
    "properties": ["transform", "opacity"]
  },
  "interactions": {
    "hover": {
      "buttons": "lift-sm scale-102",
      "cards": "lift-md",
      "links": "underline"
    },
    "press": {
      "buttons": "scale-98",
      "cards": "scale-99"
    },
    "focus": {
      "all": "ring-2 ring-primary ring-offset-2"
    }
  },
  "transitions": {
    "pageEnter": "fade-in slide-up-sm 300ms ease-out",
    "pageExit": "fade-out 200ms ease-in",
    "modal": "fade-in scale-95-to-100 200ms ease-out"
  },
  "loading": {
    "skeleton": "pulse",
    "spinner": "spin",
    "progress": "indeterminate-slide"
  },
  "reduceMotion": {
    "enabled": true,
    "fallback": "instant state changes, no transforms"
  },
  "reasoning": "Why these motion choices enhance UX"
}
"""

BUILD_WIREFRAME_PROMPT = """
You are building the final wireframe JSON based on all previous design decisions.

You have context from:
1. Layout decisions: Page structure, navigation, sections
2. Theme decisions: Colors, typography, spacing
3. Motion decisions: Animations and interactions

**CRITICAL REQUIREMENTS**:
1. You MUST include ALL pages defined in the layout decisions
2. Each page MUST have complete sections with elements
3. The wireframe MUST follow this exact structure:

{
  "meta": {
    "title": "App Title",
    "description": "App description",
    "platforms": ["web"] or ["mobile"],
    "viewport": "1440x1024" or "390x844",
    "mood": "from theme decisions",
    "primaryCta": "Main action",
    "brand": { "name": "Brand", "logoAlt": "Logo" },
    "rendererHints": {
      "framework": "react",
      "uiKit": "shadcn",
      "classStrategy": "tailwind"
    },
    "notes": "Design notes",
    "planned": "Brief summary"
  },
  "grid": {
    "breakpoints": { "sm": 360, "md": 768, "lg": 1024, "xl": 1280 },
    "columns": { "sm": 4, "md": 8, "lg": 12 },
    "gutter": 16,
    "maxWidth": 1200
  },
  "pages": [
    {
      "name": "Page Name from layout",
      "purpose": "Purpose from layout",
      "route": "/route from layout",
      "sections": [
        {
          "id": "header",
          "role": "header",
          "elements": [/* navigation elements */]
        },
        {
          "id": "content",
          "role": "content",
          "elements": [/* page content */]
        }
      ]
    }
    /* Include ALL pages from layout decisions */
  ]
}

**ELEMENT STRUCTURE** (every element MUST have ALL these fields):
{
  "type": "Component name",
  "content": { "text": "content" },
  "props": { "variant": "primary", "size": "md" },
  "styles": { "tw": "tailwind classes" },
  "attributes": {},
  "bindings": {},
  "interactions": [],
  "motion": { "transition": "from motion decisions" },
  "elements": []
}

**REMEMBER**:
- First section MUST be header with navigation
- Apply theme colors via Tailwind classes in styles.tw
- Apply motion specifications to interactive elements
- Use lucide icon names for Icon type
- Include realistic placeholder text

Return the COMPLETE wireframe with ALL pages populated.

DO NOT return empty pages array - this is the most critical requirement!
"""

