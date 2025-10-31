import type { Section, Theme } from '@/types/wireframe'

interface ModalRendererProps {
  section: Section
  theme: Theme
}

/**
 * ModalRenderer: Modal/sheet overlay
 * Centered box with shadow and backdrop
 */
export function ModalRenderer({ section, theme }: ModalRendererProps) {
  const content = section.content || {}

  return (
    <div className="rounded-lg border p-6 shadow-lg"
      style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
        borderRadius: `${theme.radius}px`,
      }}
    >
      {section.title && (
        <h3
          className="mb-4 font-bold"
          style={{
            fontSize: `${theme.typography.h3}px`,
            color: theme.colors.foreground,
          }}
        >
          {section.title}
        </h3>
      )}

      {section.description && (
        <p
          className="mb-4"
          style={{
            fontSize: `${theme.typography.body}px`,
            color: theme.colors.muted,
          }}
        >
          {section.description}
        </p>
      )}

      {content.action && (
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 font-medium transition-opacity hover:opacity-80"
            style={{
              color: theme.colors.foreground,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: `${theme.radius}px`,
              fontSize: `${theme.typography.body}px`,
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: `${theme.radius}px`,
              fontSize: `${theme.typography.body}px`,
            }}
          >
            {content.action}
          </button>
        </div>
      )}
    </div>
  )
}

