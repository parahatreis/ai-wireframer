"""
Post-processing: automatic cleanups after generation.
- Snap arbitrary gaps to nearest spacing step
- Nudge palette lightness until contrast passes
- Deduplicate near-identical sections
- Icon fallback if unknown
"""

from typing import Dict, Any, List, Tuple
from .linter import estimate_contrast, hex_to_rgb, relative_luminance


def post_process(spec: Dict[str, Any]) -> Dict[str, Any]:
    """
    Apply automatic cleanups to spec.
    
    Args:
        spec: UI spec dict
    
    Returns:
        Cleaned spec
    """
    print("=== Post-Processing ===")
    
    # Snap spacing values
    spec = snap_spacing_values(spec)
    
    # Fix contrast issues
    spec = nudge_contrast(spec)
    
    # Deduplicate sections
    spec = deduplicate_sections(spec)
    
    # Icon fallbacks
    spec = fix_unknown_icons(spec)
    
    print("✓ Post-processing complete")
    
    return spec


def snap_spacing_values(spec: Dict[str, Any]) -> Dict[str, Any]:
    """
    Snap arbitrary spacing/gap values to nearest step in chosen scale.
    """
    theme = spec.get("theme", {})
    spacing = theme.get("spacing", {})
    scale = spacing.get("scale", [4, 8, 16, 24, 32, 48])
    
    # Process all pages
    for page in spec.get("pages", []):
        for section in page.get("sections", []):
            # Snap grid gaps
            if section.get("kind") == "grid" and "grid" in section:
                grid = section["grid"]
                if "gap" in grid:
                    original_gap = grid["gap"]
                    snapped_gap = snap_to_nearest(original_gap, scale)
                    if original_gap != snapped_gap:
                        grid["gap"] = snapped_gap
                        print(f"  Snapped gap {original_gap} → {snapped_gap}")
    
    return spec


def snap_to_nearest(value: int, scale: List[int]) -> int:
    """Find nearest value in scale"""
    if not scale:
        return value
    
    return min(scale, key=lambda x: abs(x - value))


def nudge_contrast(spec: Dict[str, Any]) -> Dict[str, Any]:
    """
    Nudge color lightness until contrast passes WCAG AA.
    """
    theme = spec.get("theme", {})
    colors = theme.get("colors", {})
    
    primary = colors.get("primary", "#000000")
    foreground = colors.get("foreground", "#000000")
    background = colors.get("background", "#FFFFFF")
    
    # Check and fix primary contrast
    primary_contrast = estimate_contrast(primary, background)
    if primary_contrast < 4.5:
        print(f"  Primary contrast too low: {primary_contrast:.2f}")
        # Darken or lighten primary
        new_primary = adjust_color_for_contrast(primary, background, 4.5)
        if new_primary != primary:
            colors["primary"] = new_primary
            print(f"  Adjusted primary: {primary} → {new_primary}")
    
    # Check and fix foreground contrast
    fg_contrast = estimate_contrast(foreground, background)
    if fg_contrast < 4.5:
        print(f"  Foreground contrast too low: {fg_contrast:.2f}")
        new_foreground = adjust_color_for_contrast(foreground, background, 4.5)
        if new_foreground != foreground:
            colors["foreground"] = new_foreground
            print(f"  Adjusted foreground: {foreground} → {new_foreground}")
    
    return spec


def adjust_color_for_contrast(
    color: str,
    background: str,
    target_contrast: float,
    max_iterations: int = 10
) -> str:
    """
    Adjust color lightness to achieve target contrast.
    Simple iterative approach.
    """
    rgb = hex_to_rgb(color)
    bg_rgb = hex_to_rgb(background)
    
    # Determine if we need to go darker or lighter
    bg_lum = relative_luminance(bg_rgb)
    
    # If background is light, darken the color; if dark, lighten it
    step = -10 if bg_lum > 0.5 else 10
    
    for _ in range(max_iterations):
        current_contrast = estimate_contrast(rgb_to_hex(rgb), background)
        
        if current_contrast >= target_contrast:
            break
        
        # Adjust RGB values
        r, g, b = rgb
        r = max(0, min(255, r + step))
        g = max(0, min(255, g + step))
        b = max(0, min(255, b + step))
        rgb = (r, g, b)
    
    return rgb_to_hex(rgb)


def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    """Convert RGB tuple to hex string"""
    r, g, b = rgb
    return f"#{r:02x}{g:02x}{b:02x}"


def deduplicate_sections(spec: Dict[str, Any]) -> Dict[str, Any]:
    """
    Find and merge near-identical sections.
    For now, just detect duplicates; actual merging is complex.
    """
    for page in spec.get("pages", []):
        sections = page.get("sections", [])
        
        # Simple check: same kind + same title
        seen = {}
        duplicates = []
        
        for i, section in enumerate(sections):
            key = (section.get("kind"), section.get("title"))
            if key in seen and key[1]:  # Only if title exists
                duplicates.append((seen[key], i))
            else:
                seen[key] = i
        
        if duplicates:
            print(f"  Found {len(duplicates)} potential duplicate sections in {page.get('route')}")
            # For now just log; actual deduplication needs careful merging
    
    return spec


def fix_unknown_icons(spec: Dict[str, Any]) -> Dict[str, Any]:
    """
    Replace unknown icon names with fallback.
    """
    # List of known lucide icons (subset)
    known_icons = {
        "Home", "Search", "User", "Settings", "ShoppingCart", "Bell", "Heart",
        "Star", "Menu", "X", "ChevronLeft", "ChevronRight", "Plus", "Minus",
        "Check", "AlertCircle", "Info", "Mail", "Phone", "Calendar", "Clock",
        "MapPin", "Camera", "Image", "File", "Folder", "Edit", "Trash",
        "Download", "Upload", "Share", "Send", "MessageCircle", "Users",
        "TrendingUp", "BarChart", "PieChart", "Activity", "Zap", "Shield",
        "Lock", "Unlock", "Eye", "EyeOff"
    }
    
    fallback_icon = "Circle"
    
    for page in spec.get("pages", []):
        # Check page meta icon
        if "meta" in page and "icon" in page["meta"]:
            icon = page["meta"]["icon"]
            if icon and icon not in known_icons:
                print(f"  Unknown icon '{icon}' in page {page.get('route')}, using fallback")
                page["meta"]["icon"] = fallback_icon
        
        # Check section content for icons
        for section in page.get("sections", []):
            content = section.get("content", {})
            if isinstance(content, dict) and "icon" in content:
                icon = content["icon"]
                if icon and icon not in known_icons:
                    print(f"  Unknown icon '{icon}' in section {section.get('id')}, using fallback")
                    content["icon"] = fallback_icon
    
    return spec

