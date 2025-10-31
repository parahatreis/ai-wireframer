import type { Section, Theme } from '@/types/wireframe'

interface GridRendererProps {
  section: Section
  theme: Theme
}

/**
 * GridRenderer: Responsive grid layout
 * Uses section.grid config for columns and gap
 */
export function GridRenderer({ section, theme }: GridRendererProps) {
  const grid = section.grid || { cols: 3, gap: 24, sm_cols: 1, md_cols: 2, lg_cols: 3 }
  const content = section.content || {}
  const items = (content.items as any[]) || []

  // Grid classes based on config
  const gridClasses = `grid gap-${Math.floor(grid.gap / 4)} grid-cols-${grid.sm_cols} md:grid-cols-${grid.md_cols} lg:grid-cols-${grid.lg_cols}`

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-6xl">
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

        {section.description && (
          <p
            className="mb-8"
            style={{
              fontSize: `${theme.typography.body}px`,
              color: theme.colors.muted,
            }}
          >
            {section.description}
          </p>
        )}

        <div className={gridClasses}>
          {items.length > 0 ? (
            items.map((item, idx) => (
              <div
                key={idx}
                className="border p-6"
                style={{
                  borderColor: theme.colors.border,
                  borderRadius: `${theme.radius}px`,
                  backgroundColor: theme.colors.background,
                }}
              >
                {item.title && (
                  <h3
                    className="mb-2 font-semibold"
                    style={{
                      fontSize: `${theme.typography.h3}px`,
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
            // Placeholder grid items
            Array.from({ length: grid.lg_cols }).map((_, idx) => (
              <div
                key={idx}
                className="border p-6"
                style={{
                  borderColor: theme.colors.border,
                  borderRadius: `${theme.radius}px`,
                  backgroundColor: theme.colors.background,
                }}
              >
                <div
                  className="mb-2 h-4 w-3/4"
                  style={{ backgroundColor: theme.colors.muted }}
                />
                <div
                  className="h-3 w-full"
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

