"""
Zero-DB design priors: hard-coded patterns, palettes, scales.
These are baked constants shipped with the Python code.
"""

from typing import Dict, List, Any
from enum import Enum


# ============================================================================
# PATTERN KIT - Names only, referenced in prompts
# ============================================================================

class PatternName(str, Enum):
    """Pre-defined UI patterns"""
    HERO_LEFT = "Hero-Left"
    HERO_CENTER = "Hero-Center"
    FEATURE_3UP = "Feature-3up"
    STATS_4UP = "Stats-4up"
    LIST_DETAIL = "List-Detail"
    SETTINGS_SECTIONS = "Settings-Sections"
    AUTH_CARD = "Auth-Card"
    TABLE_WITH_FILTERS = "Table-With-Filters"
    EMPTY_STATE = "Empty-State"
    LOADING_SKELETON = "Loading-Skeleton"


PATTERN_KIT = [p.value for p in PatternName]


# ============================================================================
# PALETTE PACK - 5 palettes with light/dark pairs
# ============================================================================

PALETTES = {
    "slate": {
        "name": "slate",
        "mood": "professional, neutral, modern",
        "light": {
            "primary": "#0f172a",      # slate-900
            "secondary": "#475569",    # slate-600
            "accent": "#3b82f6",       # blue-500
            "background": "#ffffff",
            "foreground": "#0f172a",
            "muted": "#f1f5f9",        # slate-100
            "border": "#e2e8f0",       # slate-200
        },
        "dark": {
            "primary": "#f8fafc",      # slate-50
            "secondary": "#cbd5e1",    # slate-300
            "accent": "#60a5fa",       # blue-400
            "background": "#0f172a",
            "foreground": "#f8fafc",
            "muted": "#1e293b",        # slate-800
            "border": "#334155",       # slate-700
        },
    },
    "pine": {
        "name": "pine",
        "mood": "natural, calm, trustworthy",
        "light": {
            "primary": "#064e3b",      # emerald-900
            "secondary": "#059669",    # emerald-600
            "accent": "#10b981",       # emerald-500
            "background": "#ffffff",
            "foreground": "#064e3b",
            "muted": "#d1fae5",        # emerald-100
            "border": "#a7f3d0",       # emerald-200
        },
        "dark": {
            "primary": "#d1fae5",      # emerald-100
            "secondary": "#6ee7b7",    # emerald-300
            "accent": "#34d399",       # emerald-400
            "background": "#064e3b",
            "foreground": "#d1fae5",
            "muted": "#065f46",        # emerald-800
            "border": "#047857",       # emerald-700
        },
    },
    "sky": {
        "name": "sky",
        "mood": "open, friendly, tech",
        "light": {
            "primary": "#0c4a6e",      # sky-900
            "secondary": "#0284c7",    # sky-600
            "accent": "#0ea5e9",       # sky-500
            "background": "#ffffff",
            "foreground": "#0c4a6e",
            "muted": "#e0f2fe",        # sky-100
            "border": "#bae6fd",       # sky-200
        },
        "dark": {
            "primary": "#e0f2fe",      # sky-100
            "secondary": "#7dd3fc",    # sky-300
            "accent": "#38bdf8",       # sky-400
            "background": "#0c4a6e",
            "foreground": "#e0f2fe",
            "muted": "#075985",        # sky-800
            "border": "#0369a1",       # sky-700
        },
    },
    "plum": {
        "name": "plum",
        "mood": "creative, bold, premium",
        "light": {
            "primary": "#581c87",      # purple-900
            "secondary": "#9333ea",    # purple-600
            "accent": "#a855f7",       # purple-500
            "background": "#ffffff",
            "foreground": "#581c87",
            "muted": "#f3e8ff",        # purple-100
            "border": "#e9d5ff",       # purple-200
        },
        "dark": {
            "primary": "#f3e8ff",      # purple-100
            "secondary": "#d8b4fe",    # purple-300
            "accent": "#c084fc",       # purple-400
            "background": "#581c87",
            "foreground": "#f3e8ff",
            "muted": "#6b21a8",        # purple-800
            "border": "#7e22ce",       # purple-700
        },
    },
    "sand": {
        "name": "sand",
        "mood": "warm, earthy, approachable",
        "light": {
            "primary": "#78350f",      # amber-900
            "secondary": "#d97706",    # amber-600
            "accent": "#f59e0b",       # amber-500
            "background": "#ffffff",
            "foreground": "#78350f",
            "muted": "#fef3c7",        # amber-100
            "border": "#fde68a",       # amber-200
        },
        "dark": {
            "primary": "#fef3c7",      # amber-100
            "secondary": "#fcd34d",    # amber-300
            "accent": "#fbbf24",       # amber-400
            "background": "#78350f",
            "foreground": "#fef3c7",
            "muted": "#92400e",        # amber-800
            "border": "#b45309",       # amber-700
        },
    },
}


def get_palette(name: str, mode: str = "light") -> Dict[str, str]:
    """Get palette colors by name and mode"""
    if name not in PALETTES:
        name = "slate"  # Default fallback
    if mode not in ["light", "dark"]:
        mode = "light"
    return PALETTES[name][mode]


# ============================================================================
# TYPE SCALES - Predefined text size systems
# ============================================================================

TYPE_SCALES = {
    "modern": {
        "name": "modern",
        "description": "Clean, contemporary sizing with generous whitespace",
        "base_size": 16,
        "scale_ratio": 1.25,
        "h1": 48,
        "h2": 36,
        "h3": 28,
        "h4": 20,
        "body": 16,
        "small": 14,
        "tiny": 12,
    },
    "dashboard": {
        "name": "dashboard",
        "description": "Compact, information-dense layout",
        "base_size": 14,
        "scale_ratio": 1.2,
        "h1": 32,
        "h2": 24,
        "h3": 20,
        "h4": 16,
        "body": 14,
        "small": 12,
        "tiny": 11,
    },
    "marketing": {
        "name": "marketing",
        "description": "Bold, attention-grabbing hierarchy",
        "base_size": 18,
        "scale_ratio": 1.33,
        "h1": 64,
        "h2": 48,
        "h3": 36,
        "h4": 24,
        "body": 18,
        "small": 16,
        "tiny": 14,
    },
}


def get_type_scale(name: str) -> Dict[str, Any]:
    """Get type scale by name"""
    if name not in TYPE_SCALES:
        name = "modern"  # Default fallback
    return TYPE_SCALES[name]


# ============================================================================
# SPACING SCALES - Two options for spacing systems
# ============================================================================

SPACING_SCALES = {
    "compact": {
        "name": "compact",
        "description": "Tighter spacing for dense layouts",
        "unit": 4,
        "scale": [4, 8, 12, 16, 24, 32],
    },
    "relaxed": {
        "name": "relaxed",
        "description": "Generous spacing for breathing room",
        "unit": 4,
        "scale": [4, 8, 16, 24, 32, 48],
    },
}


def get_spacing_scale(name: str) -> Dict[str, Any]:
    """Get spacing scale by name"""
    if name not in SPACING_SCALES:
        name = "relaxed"  # Default fallback
    return SPACING_SCALES[name]


# ============================================================================
# APP TYPE INFERENCE - Simple keyword matching
# ============================================================================

APP_TYPE_KEYWORDS = {
    "marketing": [
        "landing page", "marketing page", "product page", "marketing site",
        "startup website", "agency site", "portfolio site", 
        "showcase site", "promo page", "promotional site",
    ],
    "dashboard": [
        "dashboard", "analytics dashboard", "admin panel", "admin dashboard",
        "metrics dashboard", "charts", "reports", "monitoring",
        "stats dashboard", "insights", "overview dashboard",
    ],
    "crud": [
        "todo app", "todo list", "task manager", "task app",
        "note app", "note taking", "tracker app", "organizer app",
        "management app", "management system", "management tool",
        "chat app", "messaging app", "message board",
        "calendar app", "contacts app", "shopping app",
        "inventory system", "crm", "cms",
    ],
    "auth-heavy": [
        "login page", "signup page", "authentication",
        "register page", "account page", "user profile",
        "settings page", "onboarding flow", "wizard",
    ],
}

# Strong functional indicators that override marketing
FUNCTIONAL_INDICATORS = [
    "todo", "task", "chat", "message", "tracker", "organizer",
    "dashboard", "admin", "management", "inventory", "crm", "cms",
    "calendar", "contacts", "notes", "shopping cart",
]


def infer_platform(prompt: str) -> str:
    """
    Infer platform (mobile/web) from prompt.
    Returns: mobile | web
    """
    prompt_lower = prompt.lower()
    
    # Explicit mobile keywords (stricter matching)
    mobile_keywords = [
        "mobile app", "ios app", "android app", "phone app",
        "smartphone", "iphone app", "mobile application",
    ]
    
    # Check for explicit mobile mentions
    for kw in mobile_keywords:
        if kw in prompt_lower:
            return "mobile"
    
    # Single word mobile indicators (weaker)
    weak_mobile = ["mobile", "ios", "android", "iphone"]
    mobile_score = sum(1 for kw in weak_mobile if kw in prompt_lower)
    
    # Only go mobile if strong signal and no web indicators
    web_indicators = ["website", "web app", "landing", "saas", "dashboard", "portal"]
    has_web = any(kw in prompt_lower for kw in web_indicators)
    
    if mobile_score > 0 and not has_web:
        return "mobile"
    
    # Default to web for ambiguous cases
    return "web"


def infer_app_type(prompt: str) -> str:
    """
    Infer app type from prompt using priority-based keyword matching.
    Priority: functional (crud/dashboard) > marketing
    Returns: marketing | dashboard | crud | auth-heavy
    """
    prompt_lower = prompt.lower()
    
    # PRIORITY 1: Check for strong functional indicators first
    # These override marketing even if "landing" or "website" is present
    for indicator in FUNCTIONAL_INDICATORS:
        if indicator in prompt_lower:
            # Determine which functional type
            if indicator in ["dashboard", "analytics", "admin", "metrics", "reports", "monitoring", "stats", "insights"]:
                return "dashboard"
            else:
                return "crud"
    
    # PRIORITY 2: Check for explicit marketing/landing language
    # Only trigger if it's CLEARLY a marketing page
    marketing_explicit = [
        "landing page", "marketing page", "marketing site",
        "product page", "promo page", "promotional",
    ]
    for phrase in marketing_explicit:
        if phrase in prompt_lower:
            return "marketing"
    
    # PRIORITY 3: Check for dashboard-specific terms
    if any(kw in prompt_lower for kw in ["dashboard", "analytics", "admin panel", "metrics", "monitoring"]):
        return "dashboard"
    
    # PRIORITY 4: Check for auth-heavy indicators
    auth_count = sum(1 for kw in APP_TYPE_KEYWORDS["auth-heavy"] if kw in prompt_lower)
    if auth_count >= 2:
        return "auth-heavy"
    
    # PRIORITY 5: Score remaining patterns
    scores = {app_type: 0 for app_type in APP_TYPE_KEYWORDS}
    
    for app_type, keywords in APP_TYPE_KEYWORDS.items():
        for keyword in keywords:
            if keyword in prompt_lower:
                scores[app_type] += 1
    
    # Marketing needs higher threshold to avoid false positives
    if scores["marketing"] > 0 and scores["marketing"] > scores.get("crud", 0):
        return "marketing"
    
    # Return type with highest score, default to crud
    max_score = max(scores.values())
    if max_score == 0:
        return "crud"
    
    return max(scores, key=scores.get)


# ============================================================================
# DEFAULT SELECTIONS - Based on inferred app type
# ============================================================================

DEFAULT_PATTERNS = {
    "marketing": ["Hero-Center", "Feature-3up", "Stats-4up"],
    "dashboard": ["Stats-4up", "Table-With-Filters", "Empty-State"],
    "crud": ["List-Detail", "Table-With-Filters", "Empty-State", "Loading-Skeleton"],
    "auth-heavy": ["Auth-Card", "Settings-Sections"],
}


DEFAULT_PALETTES = {
    "marketing": "sky",
    "dashboard": "slate",
    "crud": "slate",
    "auth-heavy": "plum",
}


DEFAULT_TYPE_SCALES = {
    "marketing": "marketing",
    "dashboard": "dashboard",
    "crud": "modern",
    "auth-heavy": "modern",
}


DEFAULT_SPACING_SCALES = {
    "marketing": "relaxed",
    "dashboard": "compact",
    "crud": "relaxed",
    "auth-heavy": "relaxed",
}


def get_defaults_for_app_type(app_type: str) -> Dict[str, Any]:
    """Get default selections based on app type"""
    return {
        "patterns": DEFAULT_PATTERNS.get(app_type, DEFAULT_PATTERNS["crud"]),
        "palette": DEFAULT_PALETTES.get(app_type, "slate"),
        "type_scale": DEFAULT_TYPE_SCALES.get(app_type, "modern"),
        "spacing_scale": DEFAULT_SPACING_SCALES.get(app_type, "relaxed"),
    }


# ============================================================================
# HELPERS - For prompt construction
# ============================================================================

def get_all_pattern_names() -> List[str]:
    """Get list of all available pattern names"""
    return PATTERN_KIT.copy()


def get_all_palette_names() -> List[str]:
    """Get list of all available palette names"""
    return list(PALETTES.keys())


def get_all_type_scale_names() -> List[str]:
    """Get list of all available type scale names"""
    return list(TYPE_SCALES.keys())


def get_all_spacing_scale_names() -> List[str]:
    """Get list of all available spacing scale names"""
    return list(SPACING_SCALES.keys())

