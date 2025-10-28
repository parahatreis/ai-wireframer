import type { WireframeSection } from '@/types/wireframe'
import { ElementRenderer } from './ElementRenderer'

interface SectionRendererProps {
  section: WireframeSection
  platform?: 'mobile' | 'web'
}

export function SectionRenderer({ section, platform = 'web' }: SectionRendererProps) {
  const { role, elements } = section
  const isMobile = platform === 'mobile'

  // Render based on section role
  switch (role) {
    case 'header':
      // Mobile: render at bottom, Web: render at top
      if (isMobile) {
        return (
          <nav className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-around gap-2">
              {elements.map((element, idx) => (
                <ElementRenderer key={idx} element={element} />
              ))}
            </div>
          </nav>
        )
      }
      return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {elements.map((element, idx) => (
              <ElementRenderer key={idx} element={element} />
            ))}
          </div>
        </header>
      )

    case 'hero':
      return (
        <section className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="max-w-3xl space-y-6">
            {elements.map((element, idx) => (
              <ElementRenderer key={idx} element={element} />
            ))}
          </div>
        </section>
      )

    case 'content':
      return (
        <section className="px-6 py-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {elements.map((element, idx) => (
              <ElementRenderer key={idx} element={element} />
            ))}
          </div>
        </section>
      )

    case 'sidebar':
      return (
        <aside className="border-l border-slate-200 bg-slate-50 px-4 py-6">
          <div className="space-y-4">
            {elements.map((element, idx) => (
              <ElementRenderer key={idx} element={element} />
            ))}
          </div>
        </aside>
      )

    case 'footer':
      return (
        <footer className="mt-auto border-t border-slate-200 bg-slate-50 px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <div>
              {elements.map((element, idx) => (
                <ElementRenderer key={idx} element={element} />
              ))}
            </div>
          </div>
        </footer>
      )

    case 'modal':
    case 'sheet':
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg">
          <div className="space-y-4">
            {elements.map((element, idx) => (
              <ElementRenderer key={idx} element={element} />
            ))}
          </div>
        </div>
      )

    default:
      return (
        <section className="px-6 py-4">
          <div className="space-y-4">
            {elements.map((element, idx) => (
              <ElementRenderer key={idx} element={element} />
            ))}
          </div>
        </section>
      )
  }
}

