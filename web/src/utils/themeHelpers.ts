import type { Theme } from '@/types/wireframe'

/**
 * Get spacing value from theme scale by index
 * @param theme - Theme object
 * @param index - Index in spacing scale array
 * @returns Spacing value as string (e.g., "16px")
 */
export function getSpacing(theme: Theme, index: number): string {
  const value = theme.spacing.scale[index] || theme.spacing.scale[0]
  return `${value}px`
}

/**
 * Convert theme colors to CSS custom properties
 * Useful for applying theme colors globally
 * @param theme - Theme object
 * @returns Object with CSS custom property names and values
 */
export function applyThemeColors(theme: Theme): Record<string, string> {
  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-background': theme.colors.background,
    '--color-foreground': theme.colors.foreground,
    '--color-muted': theme.colors.muted,
    '--color-border': theme.colors.border,
  }
}

/**
 * Get typography size value
 * @param theme - Theme object
 * @param level - Typography level (h1, h2, h3, body, small)
 * @returns Font size as string (e.g., "48px")
 */
export function getTypographySize(theme: Theme, level: keyof Typography): string {
  return `${theme.typography[level]}px`
}

/**
 * Get border radius value
 * @param theme - Theme object
 * @returns Border radius as string (e.g., "8px")
 */
export function getBorderRadius(theme: Theme): string {
  return `${theme.radius}px`
}

// Re-export Typography type for convenience
import type { Typography } from '@/types/wireframe'

