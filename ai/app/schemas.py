"""
Strict UI Spec schemas following NEW_FLOW.md specification.
Versioned JSON schema with tight enums and clamped values.
"""

from typing import Optional, Dict, Any, List, Literal
from pydantic import BaseModel, Field, field_validator
from enum import Enum


# Schema version following semantic versioning
SCHEMA_VERSION = "1.0.0"


# ============================================================================
# ENUMS - Tight constraints only
# ============================================================================

class SectionKind(str, Enum):
    """Allowed section types - no free-form values"""
    HERO = "hero"
    GRID = "grid"
    CARD = "card"
    LIST = "list"
    FORM = "form"
    TABLE = "table"
    NAV = "nav"
    FOOTER = "footer"
    MODAL = "modal"


class AppType(str, Enum):
    """Inferred application types"""
    MARKETING = "marketing"
    DASHBOARD = "dashboard"
    CRUD = "crud"
    AUTH_HEAVY = "auth-heavy"


class Platform(str, Enum):
    """Supported platforms"""
    WEB = "web"
    MOBILE = "mobile"


# ============================================================================
# REQUEST/RESPONSE
# ============================================================================

class GenerateRequest(BaseModel):
    """Request to generate a UI spec"""
    prompt: str = Field(..., min_length=1, max_length=2000)
    options: Optional[Dict[str, Any]] = Field(default_factory=dict)


class GenerateMeta(BaseModel):
    """Metadata about the generation process"""
    schema_version: str = SCHEMA_VERSION
    seed: int
    palette_name: str
    type_scale_name: str
    spacing_scale_name: str
    linter_score: int = Field(ge=0, le=100)
    passes: Dict[str, Any] = Field(default_factory=dict)
    timestamp: str
    app_type: Optional[AppType] = None


class GenerateResponse(BaseModel):
    """Response containing spec and metadata"""
    spec: Dict[str, Any]  # The full UISpec as dict
    meta: GenerateMeta


# ============================================================================
# UI SPEC - Core Models
# ============================================================================

class ThemeColors(BaseModel):
    """Color tokens from chosen palette"""
    primary: str
    secondary: str
    accent: str
    background: str
    foreground: str
    muted: str
    border: str
    
    @field_validator('primary', 'secondary', 'accent', 'background', 'foreground', 'muted', 'border')
    @classmethod
    def validate_hex_color(cls, v: str) -> str:
        """Ensure colors are valid hex codes"""
        if not v.startswith('#') or len(v) not in [4, 7]:
            raise ValueError(f"Invalid hex color: {v}")
        return v


class ThemeTypography(BaseModel):
    """Typography scale"""
    base_size: int = Field(ge=12, le=20, default=16)
    scale_ratio: float = Field(ge=1.1, le=1.5, default=1.25)
    h1: int = Field(ge=28, le=72)
    h2: int = Field(ge=24, le=56)
    h3: int = Field(ge=20, le=40)
    body: int = Field(ge=14, le=18)
    small: int = Field(ge=12, le=16)


class ThemeSpacing(BaseModel):
    """Spacing scale - only values from chosen scale allowed"""
    scale: List[int] = Field(..., min_length=5, max_length=8)
    unit: int = Field(ge=2, le=8, default=4)
    
    @field_validator('scale')
    @classmethod
    def validate_scale(cls, v: List[int]) -> List[int]:
        """Ensure scale is sorted and reasonable"""
        if v != sorted(v):
            raise ValueError("Spacing scale must be sorted")
        if any(x < 0 or x > 256 for x in v):
            raise ValueError("Spacing values must be between 0 and 256")
        return v


class Theme(BaseModel):
    """Theme tokens chosen in Pass C"""
    palette_name: str
    type_scale_name: str
    spacing_scale_name: str
    colors: ThemeColors
    typography: ThemeTypography
    spacing: ThemeSpacing
    radius: int = Field(ge=0, le=16, default=8)
    shadows: int = Field(ge=1, le=2, default=1)  # Max 2 shadow styles


class GridConfig(BaseModel):
    """Grid configuration with clamped values"""
    cols: int = Field(ge=1, le=4, default=1)
    gap: int = Field(ge=0, le=48)  # Must snap to spacing scale
    
    # Responsive breakpoints
    sm_cols: int = Field(ge=1, le=1, default=1)  # Mobile always 1
    md_cols: int = Field(ge=1, le=2, default=1)
    lg_cols: int = Field(ge=1, le=4, default=1)


class SectionState(BaseModel):
    """State variations for a section"""
    has_empty: bool = False
    has_loading: bool = False
    has_error: bool = False


class FormField(BaseModel):
    """Form field definition"""
    name: str
    label: str
    type: Literal["text", "email", "password", "number", "select", "checkbox", "textarea"]
    placeholder: Optional[str] = None
    required: bool = False
    validation: Optional[str] = None  # Regex or validation hint
    helper_text: Optional[str] = None


class TableColumn(BaseModel):
    """Table column definition"""
    key: str
    label: str
    type: Literal["text", "number", "date", "badge", "action"]
    sortable: bool = False
    width: Optional[str] = None  # e.g., "20%", "auto"


class Section(BaseModel):
    """A section within a page"""
    id: str
    kind: SectionKind
    title: Optional[str] = None
    description: Optional[str] = None
    
    # Grid-specific
    grid: Optional[GridConfig] = None
    
    # Form-specific
    fields: Optional[List[FormField]] = None
    submit_label: Optional[str] = None
    
    # Table-specific
    columns: Optional[List[TableColumn]] = None
    
    # List-specific
    item_count: Optional[int] = None
    
    # Content
    content: Optional[Dict[str, Any]] = None
    
    # State support
    states: Optional[SectionState] = None


class PageMeta(BaseModel):
    """Page-level metadata"""
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None  # lucide icon name


class Page(BaseModel):
    """A page in the application"""
    route: str
    meta: PageMeta
    sections: List[Section] = Field(..., min_length=1)


class UISpecMeta(BaseModel):
    """Top-level spec metadata"""
    title: str
    description: Optional[str] = None
    app_type: Optional[AppType] = None
    platform: Platform = Platform.WEB


class UISpec(BaseModel):
    """Complete UI Specification - the contract"""
    version: str = SCHEMA_VERSION
    meta: UISpecMeta
    theme: Theme
    pages: List[Page] = Field(..., min_length=1)  # At least 1 page
    states: Dict[str, Any] = Field(default_factory=dict)  # Global states


# ============================================================================
# PASS INTERMEDIATE SCHEMAS
# ============================================================================

class LayoutPlan(BaseModel):
    """Output of Pass A - Layout structure without colors/content"""
    pages: List[Dict[str, Any]]  # Page routes, sections list
    nav_items: List[str]
    required_patterns: List[str]  # Pattern names from kit
    inferred_states: List[str]  # Which pages need empty/loading/error


class ContentPlan(BaseModel):
    """Output of Pass B - Content and copy, still no theme"""
    layout: LayoutPlan  # Carries forward
    page_content: Dict[str, Any]  # Labels, CTAs, copy per page
    form_fields: Dict[str, List[FormField]]  # Form definitions
    table_columns: Dict[str, List[TableColumn]]  # Table definitions
    cta_targets: Dict[str, str]  # Button actions


class ThemedSpec(BaseModel):
    """Output of Pass C - Complete spec with theme applied"""
    spec: Dict[str, Any]  # Full UISpec as dict
    palette_name: str
    type_scale_name: str
    spacing_scale_name: str
