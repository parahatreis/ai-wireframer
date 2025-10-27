import { ElementRenderer } from '../ElementRenderer'
import type { WorkspacePage } from './types'

interface PageBoardProps {
  page: WorkspacePage
}

export function PageBoard({ page }: PageBoardProps) {
  return (
    <div>
      <div
        className="absolute rounded-xl bg-transparent"
        style={{
          left: page.x,
          top: page.y,
          width: page.w,
          height: page.h,
        }}
      >
        <div className="relative h-full w-full overflow-hidde">
          <div className="text-md font-medium text-black pb-4">
            {page.name}
          </div>
          <div className="space-y-4 text-slate-800 bg-white border border-black/5 shadow-xl shadow-black/10 p-8">
            {page.elements?.map((element, idx) => (
              <ElementRenderer key={idx} element={element} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


