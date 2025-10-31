import type { Section, Theme } from '@/types/wireframe'

interface ListRendererProps {
  section: Section
  theme: Theme
}

/**
 * ListRenderer: List of items
 * Vertical stack of items with optional dividers
 */
export function ListRenderer({ section, theme }: ListRendererProps) {
  const content = section.content || {}
  const items = (content.items as any[]) || []

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-4xl">
        {section.title && (
          <h2
            className="mb-6 font-bold"
            style={{
              fontSize: `${theme.typography.h2}px`,
              color: theme.colors.foreground,
            }}
          >
            {section.title}
          </h2>
        )}

        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={idx}
                className="border-b pb-4 last:border-b-0"
                style={{ borderColor: theme.colors.border }}
              >
                {item.title && (
                  <h3
                    className="mb-1 font-medium"
                    style={{
                      fontSize: `${theme.typography.body + 2}px`,
                      color: theme.colors.foreground,
                    }}
                  >
                    {item.title}
                  </h3>
                )}
                {item.description && (
                  <p
                    style={{
                      fontSize: `${theme.typography.body}px`,
                      color: theme.colors.muted,
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            // Placeholder items
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="border-b pb-4"
                style={{ borderColor: theme.colors.border }}
              >
                <div
                  className="mb-2 h-4 w-1/2"
                  style={{ backgroundColor: theme.colors.muted }}
                />
                <div
                  className="h-3 w-3/4"
                  style={{ backgroundColor: theme.colors.muted }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

