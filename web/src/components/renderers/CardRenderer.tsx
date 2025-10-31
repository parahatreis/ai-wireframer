import type { Section, Theme } from '@/types/wireframe'

interface CardRendererProps {
  section: Section
  theme: Theme
}

/**
 * CardRenderer: Single card component
 * Box with border, padding, and optional shadow
 */
export function CardRenderer({ section, theme }: CardRendererProps) {
  const content = section.content || {}
  const title = section.title || content.title
  const description = section.description || content.description
  const action = content.action || content.cta

  return (
    <div
      className="border p-6 shadow-sm transition-shadow hover:shadow-md"
      style={{
        borderColor: theme.colors.border,
        borderRadius: `${theme.radius}px`,
        backgroundColor: theme.colors.background,
      }}
    >
      {title && (
        <h3
          className="mb-2 font-semibold"
          style={{
            fontSize: `${theme.typography.h3}px`,
            color: theme.colors.foreground,
          }}
        >
          {title}
        </h3>
      )}

      {description && (
        <p
          className="mb-4"
          style={{
            fontSize: `${theme.typography.body}px`,
            color: theme.colors.muted,
          }}
        >
          {description}
        </p>
      )}

      {action && (
        <button
          className="font-medium transition-opacity hover:opacity-80"
          style={{
            color: theme.colors.primary,
            fontSize: `${theme.typography.body}px`,
          }}
        >
          {action}
        </button>
      )}
    </div>
  )
}

