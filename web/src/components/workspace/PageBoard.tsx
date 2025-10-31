import { SectionKindRenderer } from '../renderers'
import { useTheme } from '../ThemeProvider'
import type { WorkspacePage } from './types'

interface PageBoardProps {
  page: WorkspacePage
  platform?: 'mobile' | 'web'
}

/**
 * PageBoard: Renders a single page with its sections
 * Uses NEW_FLOW section kind-based rendering
 */
export function PageBoard({ page, platform = 'web' }: PageBoardProps) {
  const theme = useTheme()
  const hasSections = page.sections && page.sections.length > 0
  const backgroundColor = theme.colors?.background ?? '#ffffff'
  
  return (
    <div>
      <div
        className="absolute"
        style={{
          left: page.x,
          top: page.y,
          width: page.w,
        }}
      >
        {/* Page title */}
        <div className="mb-3 text-sm font-semibold text-slate-700">
          {page.name}
        </div>
        
        {/* Page content with fixed dimensions */}
        <div
          className="relative flex flex-col overflow-auto rounded-lg border border-slate-200 shadow-lg"
          style={{
            width: page.w,
            height: page.h,
            backgroundColor,
          }}
        >
          {hasSections ? (
            // Render sections using new SectionKindRenderer
            page.sections!.map((section, idx) => (
              <SectionKindRenderer
                key={section.id || idx}
                section={section}
                theme={theme}
                platform={platform}
              />
            ))
          ) : (
            // No sections: empty state
            <div className="flex h-full items-center justify-center p-6 text-slate-400">
              No sections to render
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


