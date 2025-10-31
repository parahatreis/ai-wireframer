import type { Section, Theme } from '@/types/wireframe'

interface HeroRendererProps {
  section: Section
  theme: Theme
}

/**
 * HeroRenderer: Hero section with headline, description, CTAs
 * Centered layout with primary and secondary actions
 */
export function HeroRenderer({ section, theme }: HeroRendererProps) {
  const content = section.content || {}
  const title = section.title || content.headline || 'Welcome'
  const description = section.description || content.description || ''
  const ctaPrimary = content.cta_primary || content.primaryCta || 'Get Started'
  const ctaSecondary = content.cta_secondary || content.secondaryCta

  return (
    <section className="flex min-h-[400px] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Headline */}
        <h1
          className="font-bold leading-tight"
          style={{
            fontSize: `${theme.typography.h1}px`,
            color: theme.colors.foreground,
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            className="leading-relaxed"
            style={{
              fontSize: `${theme.typography.body + 2}px`,
              color: theme.colors.muted,
            }}
          >
            {description}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            className="px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: `${theme.radius}px`,
              fontSize: `${theme.typography.body}px`,
            }}
          >
            {ctaPrimary}
          </button>

          {ctaSecondary && (
            <button
              className="px-6 py-3 font-medium transition-opacity hover:opacity-90"
              style={{
                color: theme.colors.foreground,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: `${theme.radius}px`,
                fontSize: `${theme.typography.body}px`,
              }}
            >
              {ctaSecondary}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

