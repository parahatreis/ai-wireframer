// NEW_FLOW: Updated types to match AI service spec format

// ============================================================================
// CORE SPEC STRUCTURE
// ============================================================================

export interface GenerateResponse {
  spec: UISpec
  meta: GenerationMeta
}

export interface UISpec {
  version: string
  meta: UISpecMeta
  theme: Theme
  pages: Page[]
  states?: Record<string, any>
}

export interface UISpecMeta {
  title: string
  description?: string
  app_type?: string
  platform?: string
}

// ============================================================================
// THEME
// ============================================================================

export interface Theme {
  palette_name: string
  type_scale_name: string
  spacing_scale_name: string
  colors: ThemeColors
  typography: Typography
  spacing: Spacing
  radius: number
  shadows: number
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
}

export interface Typography {
  base_size: number
  scale_ratio: number
  h1: number
  h2: number
  h3: number
  body: number
  small: number
}

export interface Spacing {
  scale: number[]
  unit: number
}

// ============================================================================
// PAGE STRUCTURE
// ============================================================================

export interface Page {
  route: string
  meta: PageMeta
  sections: Section[]
}

export interface PageMeta {
  title: string
  description?: string
  icon?: string
}

// ============================================================================
// SECTION STRUCTURE (NO nested elements)
// ============================================================================

export type SectionKind = 'nav' | 'hero' | 'grid' | 'card' | 'list' | 'form' | 'table' | 'footer' | 'modal'

export interface Section {
  id: string
  kind: SectionKind
  title?: string
  description?: string
  content?: Record<string, any>
  
  // Kind-specific fields
  grid?: GridConfig
  fields?: FormField[]
  columns?: TableColumn[]
  states?: SectionState
}

export interface GridConfig {
  cols: number
  gap: number
  sm_cols: number
  md_cols: number
  lg_cols: number
}

export interface FormField {
  name: string
  label: string
  type: string
  placeholder?: string
  required?: boolean
  validation?: string
  helper_text?: string
}

export interface TableColumn {
  key: string
  label: string
  type: string
  sortable?: boolean
  width?: string
}

export interface SectionState {
  has_empty?: boolean
  has_loading?: boolean
  has_error?: boolean
}

// ============================================================================
// GENERATION METADATA
// ============================================================================

export interface GenerationMeta {
  schema_version: string
  seed: number
  palette_name: string
  type_scale_name: string
  spacing_scale_name: string
  linter_score: number
  passes: Record<string, any>
  timestamp: string
  app_type?: string
}

// ============================================================================
// LEGACY TYPES (for backward compatibility during transition)
// ============================================================================

// Keep minimal old types for any remaining references
export interface WireframeResponse {
  meta: any
  pages: any[]
}
