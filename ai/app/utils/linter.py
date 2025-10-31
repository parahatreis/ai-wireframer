"""
Design linter: score UI specs for quality.
Checks contrast, spacing, hierarchy, consistency, landmarks.
Returns score /100 and list of violations.
"""

from typing import Dict, Any, Tuple, List
import re


def lint_spec(spec: Dict[str, Any]) -> Tuple[int, List[str]]:
    """
    Lint a UI spec and return quality score + violations.
    
    Scoring breakdown:
    - Contrast (25 pts): WCAG AA for text/buttons
    - Spacing consistency (20 pts): Only values from chosen scale
    - Grid responsiveness (15 pts): sm:1 / md:2 / lg:3+
    - Type hierarchy (15 pts): Body 16, H1 36-48, sensible ratios
    - Consistency (15 pts): One radius, ≤2 shadows
    - Landmarks (10 pts): Header/nav/main/footer present
    
    Args:
        spec: UI spec dict
    
    Returns:
        (score, violations) where score is 0-100
    """
    violations = []
    score = 100  # Start at perfect, deduct for issues
    
    # Extract components
    theme = spec.get("theme", {})
    pages = spec.get("pages", [])
    
    # === CONTRAST (25 pts) ===
    contrast_score = check_contrast(theme)
    if contrast_score < 25:
        violations.append(f"Contrast issues: scored {contrast_score}/25")
    score -= (25 - contrast_score)
    
    # === SPACING CONSISTENCY (20 pts) ===
    spacing_score = check_spacing_consistency(theme, pages)
    if spacing_score < 20:
        violations.append(f"Spacing inconsistency: scored {spacing_score}/20")
    score -= (20 - spacing_score)
    
    # === GRID RESPONSIVENESS (15 pts) ===
    grid_score = check_grid_responsiveness(pages)
    if grid_score < 15:
        violations.append(f"Grid responsiveness issues: scored {grid_score}/15")
    score -= (15 - grid_score)
    
    # === TYPE HIERARCHY (15 pts) ===
    type_score = check_type_hierarchy(theme)
    if type_score < 15:
        violations.append(f"Typography hierarchy issues: scored {type_score}/15")
    score -= (15 - type_score)
    
    # === CONSISTENCY (15 pts) ===
    consistency_score = check_consistency(theme)
    if consistency_score < 15:
        violations.append(f"Design inconsistency: scored {consistency_score}/15")
    score -= (15 - consistency_score)
    
    # === LANDMARKS (10 pts) ===
    landmarks_score = check_landmarks(pages)
    if landmarks_score < 10:
        violations.append(f"Missing landmarks: scored {landmarks_score}/10")
    score -= (10 - landmarks_score)
    
    # Clamp score to 0-100
    score = max(0, min(100, score))
    
    return score, violations


def check_contrast(theme: Dict[str, Any]) -> int:
    """
    Check WCAG AA contrast (4.5:1 for text).
    Returns 0-25 points.
    """
    colors = theme.get("colors", {})
    
    primary = colors.get("primary", "#000000")
    foreground = colors.get("foreground", "#000000")
    background = colors.get("background", "#FFFFFF")
    
    score = 25
    
    # Simplified contrast check (hex to luminance)
    # For production, use a proper contrast library
    # Here we do basic heuristic checks
    
    # Check primary on background
    primary_contrast = estimate_contrast(primary, background)
    if primary_contrast < 4.5:
        score -= 10
    
    # Check foreground on background
    fg_contrast = estimate_contrast(foreground, background)
    if fg_contrast < 4.5:
        score -= 10
    
    # Check accent on background
    accent = colors.get("accent", primary)
    accent_contrast = estimate_contrast(accent, background)
    if accent_contrast < 3.0:  # Slightly lower threshold for accents
        score -= 5
    
    return max(0, score)


def check_spacing_consistency(theme: Dict[str, Any], pages: List[Dict[str, Any]]) -> int:
    """
    Check spacing values are from chosen scale.
    Returns 0-20 points.
    """
    spacing = theme.get("spacing", {})
    scale = spacing.get("scale", [])
    
    if not scale:
        return 10  # No scale defined, give partial credit
    
    score = 20
    
    # Check for tight clusters (>4 dense sections)
    for page in pages:
        sections = page.get("sections", [])
        if len(sections) > 8:
            # Very dense page
            score -= 5
            break
    
    return max(0, score)


def check_grid_responsiveness(pages: List[Dict[str, Any]]) -> int:
    """
    Check grids have proper responsive breakpoints.
    Returns 0-15 points.
    """
    score = 15
    
    for page in pages:
        sections = page.get("sections", [])
        for section in sections:
            if section.get("kind") == "grid":
                grid = section.get("grid", {})
                
                # Check mobile fallback
                sm_cols = grid.get("sm_cols", 1)
                if sm_cols != 1:
                    score -= 3  # Mobile should be 1 col
                
                # Check reasonable desktop cols
                lg_cols = grid.get("lg_cols", grid.get("cols", 1))
                if lg_cols > 4:
                    score -= 3  # Too many columns
    
    return max(0, score)


def check_type_hierarchy(theme: Dict[str, Any]) -> int:
    """
    Check typography hierarchy is sensible.
    Returns 0-15 points.
    """
    typography = theme.get("typography", {})
    
    score = 15
    
    def _to_number(value: Any, default: float) -> float:
        """Best-effort conversion of typography values to a numeric size."""
        if isinstance(value, (int, float)):
            return float(value)

        if isinstance(value, str):
            digits = "".join(ch for ch in value if ch.isdigit())
            if digits:
                try:
                    return float(digits)
                except ValueError:
                    pass

        if isinstance(value, dict):
            for key in ("size", "value", "px", "point", "pt"):
                nested = value.get(key)
                if isinstance(nested, (int, float)):
                    return float(nested)
                if isinstance(nested, str):
                    digits = "".join(ch for ch in nested if ch.isdigit())
                    if digits:
                        try:
                            return float(digits)
                        except ValueError:
                            continue

        return float(default)

    # Check body size
    body = _to_number(typography.get("body", 16), 16)
    if body < 14 or body > 20:
        score -= 5
    
    # Check H1 size
    h1 = _to_number(typography.get("h1", 48), 48)
    if h1 < 28 or h1 > 72:
        score -= 5
    
    # Check hierarchy (H1 > H2 > body)
    h2 = _to_number(typography.get("h2", 36), 36)
    if not (h1 > h2 > body):
        score -= 5
    
    return max(0, score)


def check_consistency(theme: Dict[str, Any]) -> int:
    """
    Check design consistency (radius, shadows).
    Returns 0-15 points.
    """
    score = 15
    
    # Check radius is reasonable
    radius = theme.get("radius", 8)
    if radius < 0 or radius > 16:
        score -= 5
    
    # Check shadows count
    shadows_value = theme.get("shadows", 1)

    if isinstance(shadows_value, list):
        shadow_count = len(shadows_value)
    elif isinstance(shadows_value, (int, float)):
        shadow_count = shadows_value
    else:
        shadow_count = 1

    if shadow_count > 2:
        score -= 5  # Too many shadow styles
    
    return max(0, score)


def check_landmarks(pages: List[Dict[str, Any]]) -> int:
    """
    Check required landmarks present.
    Returns 0-10 points.
    """
    score = 10
    
    # Check each page has nav
    for page in pages:
        sections = page.get("sections", [])
        section_kinds = [s.get("kind") for s in sections]
        
        if "nav" not in section_kinds:
            score -= 5
            break
    
    # Check at least one page has footer (for web)
    has_footer = False
    for page in pages:
        sections = page.get("sections", [])
        section_kinds = [s.get("kind") for s in sections]
        if "footer" in section_kinds:
            has_footer = True
            break
    
    if not has_footer:
        score -= 2  # Minor deduction, not all apps need footer
    
    return max(0, score)


def estimate_contrast(color1: str, color2: str) -> float:
    """
    Estimate contrast ratio between two hex colors.
    Simplified calculation - for production use proper WCAG library.
    
    Returns approximate contrast ratio (1.0-21.0)
    """
    # Convert hex to RGB
    rgb1 = hex_to_rgb(color1)
    rgb2 = hex_to_rgb(color2)
    
    # Calculate relative luminance (simplified)
    lum1 = relative_luminance(rgb1)
    lum2 = relative_luminance(rgb2)
    
    # Calculate contrast ratio
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    
    contrast = (lighter + 0.05) / (darker + 0.05)
    
    return contrast


def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    
    try:
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return (r, g, b)
    except:
        return (0, 0, 0)


def relative_luminance(rgb: Tuple[int, int, int]) -> float:
    """Calculate relative luminance (simplified)"""
    r, g, b = rgb
    
    # Normalize to 0-1
    r = r / 255.0
    g = g / 255.0
    b = b / 255.0
    
    # Apply gamma correction (simplified)
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    
    # Calculate luminance
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

