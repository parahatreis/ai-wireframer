import { NavRenderer } from './NavRenderer'
import { HeroRenderer } from './HeroRenderer'
import { GridRenderer } from './GridRenderer'
import { CardRenderer } from './CardRenderer'
import { ListRenderer } from './ListRenderer'
import { FormRenderer } from './FormRenderer'
import { TableRenderer } from './TableRenderer'
import { FooterRenderer } from './FooterRenderer'
import { ModalRenderer } from './ModalRenderer'
import type { Section, Theme } from '@/types/wireframe'

interface SectionRendererProps {
  section: Section
  theme: Theme
  platform?: 'web' | 'mobile'
}

/**
 * SectionKindRenderer: Main delegator for section kind-based rendering
 * Routes to appropriate renderer based on section.kind
 * Uses ONLY Tailwind CSS (no shadcn components)
 */
export function SectionKindRenderer({ section, theme, platform = 'web' }: SectionRendererProps) {
  switch (section.kind) {
    case 'nav':
      return <NavRenderer section={section} theme={theme} platform={platform} />
    case 'hero':
      return <HeroRenderer section={section} theme={theme} />
    case 'grid':
      return <GridRenderer section={section} theme={theme} />
    case 'card':
      return <CardRenderer section={section} theme={theme} />
    case 'list':
      return <ListRenderer section={section} theme={theme} />
    case 'form':
      return <FormRenderer section={section} theme={theme} />
    case 'table':
      return <TableRenderer section={section} theme={theme} />
    case 'footer':
      return <FooterRenderer section={section} theme={theme} />
    case 'modal':
      return <ModalRenderer section={section} theme={theme} />
    default:
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
          Unknown section kind: {section.kind}
        </div>
      )
  }
}

