import { Skeleton } from '@/theme/components/skeleton'
import { cn } from '@/lib/utils'
import WireframeRenderer from './WireframeRenderer'
import type { WireframeResponse } from '@/types/wireframe'

interface CanvasRendererProps {
  isGenerating: boolean
  hasResult: boolean
  gridEnabled: boolean
  wireframeData?: WireframeResponse | null
}

export default function CanvasRenderer({ isGenerating, hasResult, gridEnabled, wireframeData }: CanvasRendererProps) {
  if (isGenerating) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <span className="text-xl font-medium text-foreground">AI is sketching…</span>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-36 flex-1" />
            <Skeleton className="h-36 flex-1" />
          </div>
          <Skeleton className="h-72 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-28 flex-1" />
            <Skeleton className="h-28 flex-1" />
            <Skeleton className="h-28 flex-1" />
          </div>
        </div>
      </div>
    )
  }

  if (!hasResult) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-6 text-7xl">🎨</div>
          <h3 className="text-2xl font-semibold text-foreground">No wireframe yet</h3>
          <p className="mt-3 text-lg text-muted-foreground">Enter a prompt and click Generate to start</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('h-full bg-gradient-canvas p-8', gridEnabled && 'bg-grid-pattern')}>
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 transition-all duration-500 border border-gray-200 shadow-lg">
        {wireframeData ? (
          <WireframeRenderer data={wireframeData} />
        ) : (
          <div className="text-center text-gray-500">
            No wireframe data available
          </div>
        )}
      </div>
    </div>
  )
}

