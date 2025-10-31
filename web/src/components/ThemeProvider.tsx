import { createContext, useContext, ReactNode, useMemo } from 'react'
import type { Theme, ThemeColors, Typography, Spacing } from '@/types/wireframe'

const ThemeContext = createContext<Theme | null>(null)

interface ThemeProviderProps {
  theme: Theme
  children: ReactNode
}

const DEFAULT_COLORS: ThemeColors = {
  primary: '#1d4ed8',
  secondary: '#2563eb',
  accent: '#60a5fa',
  background: '#ffffff',
  foreground: '#111827',
  muted: '#e5e7eb',
  border: '#d1d5db',
}

const DEFAULT_TYPOGRAPHY: Typography = {
  base_size: 16,
  scale_ratio: 1.25,
  h1: 48,
  h2: 36,
  h3: 28,
  body: 16,
  small: 14,
}

const DEFAULT_SPACING: Spacing = {
  scale: [4, 8, 16, 24, 32, 48],
  unit: 4,
}

const DEFAULT_THEME: Theme = {
  palette_name: 'default',
  type_scale_name: 'default',
  spacing_scale_name: 'default',
  colors: DEFAULT_COLORS,
  typography: DEFAULT_TYPOGRAPHY,
  spacing: DEFAULT_SPACING,
  radius: 8,
  shadows: 1,
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const numeric = parseFloat(value)
    if (Number.isFinite(numeric)) {
      return numeric
    }
  }
  if (typeof value === 'object' && value !== null) {
    // Look for common nested keys
    for (const key of ['size', 'value', 'px', 'pt']) {
      const nested = (value as Record<string, unknown>)[key]
      if (typeof nested === 'number' && Number.isFinite(nested)) {
        return nested
      }
      if (typeof nested === 'string') {
        const numeric = parseFloat(nested)
        if (Number.isFinite(numeric)) {
          return numeric
        }
      }
    }
  }
  return fallback
}

function normalizeTheme(input?: Theme | null): Theme {
  const base = input ?? DEFAULT_THEME

  const colorsSource = (base as Partial<Theme>).colors ?? DEFAULT_COLORS
  const colors: ThemeColors = {
    primary: typeof colorsSource.primary === 'string' ? colorsSource.primary : DEFAULT_COLORS.primary,
    secondary: typeof colorsSource.secondary === 'string' ? colorsSource.secondary : DEFAULT_COLORS.secondary,
    accent: typeof colorsSource.accent === 'string' ? colorsSource.accent : DEFAULT_COLORS.accent,
    background: typeof colorsSource.background === 'string' ? colorsSource.background : DEFAULT_COLORS.background,
    foreground: typeof colorsSource.foreground === 'string' ? colorsSource.foreground : DEFAULT_COLORS.foreground,
    muted: typeof colorsSource.muted === 'string' ? colorsSource.muted : DEFAULT_COLORS.muted,
    border: typeof colorsSource.border === 'string' ? colorsSource.border : DEFAULT_COLORS.border,
  }

  const typographySource = (base as Partial<Theme>).typography ?? DEFAULT_TYPOGRAPHY
  const typography: Typography = {
    base_size: toNumber(typographySource.base_size, DEFAULT_TYPOGRAPHY.base_size),
    scale_ratio: toNumber(typographySource.scale_ratio, DEFAULT_TYPOGRAPHY.scale_ratio),
    h1: toNumber(typographySource.h1, DEFAULT_TYPOGRAPHY.h1),
    h2: toNumber(typographySource.h2, DEFAULT_TYPOGRAPHY.h2),
    h3: toNumber(typographySource.h3, DEFAULT_TYPOGRAPHY.h3),
    body: toNumber(typographySource.body, DEFAULT_TYPOGRAPHY.body),
    small: toNumber(typographySource.small, DEFAULT_TYPOGRAPHY.small),
  }

  const spacingSource = (base as Partial<Theme>).spacing ?? DEFAULT_SPACING
  const spacingScale = Array.isArray(spacingSource.scale)
    ? spacingSource.scale
        .map((value) => toNumber(value, NaN))
        .filter((value) => Number.isFinite(value) && value >= 0)
    : DEFAULT_SPACING.scale

  const spacing: Spacing = {
    scale: spacingScale.length > 0 ? spacingScale : DEFAULT_SPACING.scale,
    unit: toNumber(spacingSource.unit, DEFAULT_SPACING.unit),
  }

  return {
    palette_name: typeof base.palette_name === 'string' && base.palette_name.length > 0 ? base.palette_name : DEFAULT_THEME.palette_name,
    type_scale_name:
      typeof base.type_scale_name === 'string' && base.type_scale_name.length > 0
        ? base.type_scale_name
        : DEFAULT_THEME.type_scale_name,
    spacing_scale_name:
      typeof base.spacing_scale_name === 'string' && base.spacing_scale_name.length > 0
        ? base.spacing_scale_name
        : DEFAULT_THEME.spacing_scale_name,
    colors,
    typography,
    spacing,
    radius: toNumber(base.radius, DEFAULT_THEME.radius),
    shadows: toNumber(base.shadows, DEFAULT_THEME.shadows),
  }
}

/**
 * ThemeProvider: Provides theme context to renderer components
 * Theme includes colors, typography, spacing, and radius from AI service
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const normalizedTheme = useMemo(() => normalizeTheme(theme), [theme])

  return <ThemeContext.Provider value={normalizedTheme}>{children}</ThemeContext.Provider>
}

/**
 * useTheme: Hook to access theme in renderer components
 * @returns Theme object with colors, typography, spacing, radius
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): Theme {
  const theme = useContext(ThemeContext)
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return theme
}

