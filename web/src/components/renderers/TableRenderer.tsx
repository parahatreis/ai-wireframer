import type { Section, Theme } from '@/types/wireframe'

interface TableRendererProps {
  section: Section
  theme: Theme
}

/**
 * TableRenderer: Data table with columns from section.columns[]
 * Responsive table with headers and sample data rows
 */
export function TableRenderer({ section, theme }: TableRendererProps) {
  const columns = section.columns || []
  const content = section.content || {}
  const rows = (content.rows as any[]) || []

  // Generate sample rows if none provided
  const displayRows = rows.length > 0 ? rows : Array.from({ length: 3 }, () => ({}))

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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: theme.colors.border }}
              >
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left font-medium"
                    style={{
                      fontSize: `${theme.typography.body}px`,
                      color: theme.colors.foreground,
                      width: col.width,
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b transition-colors hover:bg-opacity-50"
                  style={{
                    borderColor: theme.colors.border,
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3"
                      style={{
                        fontSize: `${theme.typography.body}px`,
                        color: theme.colors.foreground,
                      }}
                    >
                      {row[col.key] || (
                        <div
                          className="h-3 w-20"
                          style={{ backgroundColor: theme.colors.muted }}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

