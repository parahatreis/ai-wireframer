import type { Section, Theme } from '@/types/wireframe'

interface FooterRendererProps {
  section: Section
  theme: Theme
}

/**
 * FooterRenderer: Footer section
 * Bottom area with links, copyright, etc.
 */
export function FooterRenderer({ section, theme }: FooterRendererProps) {
  const content = section.content || {}
  const copyright = content.copyright || `© ${new Date().getFullYear()} All rights reserved`
  const links = (content.links as string[]) || []

  return (
    <footer
      className="mt-auto border-t px-6 py-8"
      style={{
        backgroundColor: theme.colors.muted,
        borderColor: theme.colors.border,
      }}
    >
      <div className="mx-auto max-w-6xl">
        {section.title && (
          <h3
            className="mb-4 font-semibold"
            style={{
              fontSize: `${theme.typography.h3}px`,
              color: theme.colors.foreground,
            }}
          >
            {section.title}
          </h3>
        )}

        {links.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-6">
            {links.map((link, idx) => (
              <a
                key={idx}
                href="#"
                className="transition-opacity hover:opacity-70"
                style={{
                  color: theme.colors.foreground,
                  fontSize: `${theme.typography.small}px`,
                }}
              >
                {link}
              </a>
            ))}
          </div>
        )}

        <div
          className="text-sm"
          style={{
            color: theme.colors.muted,
            fontSize: `${theme.typography.small}px`,
          }}
        >
          {copyright}
        </div>
      </div>
    </footer>
  )
}

