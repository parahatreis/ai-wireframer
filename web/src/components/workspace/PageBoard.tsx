import { ElementRenderer } from '../ElementRenderer'
import { SectionRenderer } from '../SectionRenderer'
import type { WorkspacePage } from './types'

interface PageBoardProps {
  page: WorkspacePage
}

export function PageBoard({ page }: PageBoardProps) {
  const hasSections = page.sections && page.sections.length > 0
  
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
          className="flex flex-col overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
          style={{
            width: page.w,
            height: page.h,
          }}
        >
          {hasSections ? (
            // Render using sections (new schema)
            page.sections!.map((section, idx) => (
              <SectionRenderer key={section.id || idx} section={section} />
            ))
          ) : (
            // Fallback: render elements directly (backward compatibility)
            <div className="space-y-4 p-6 text-slate-800">
              {page.elements?.map((element, idx) => (
                <ElementRenderer key={idx} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


