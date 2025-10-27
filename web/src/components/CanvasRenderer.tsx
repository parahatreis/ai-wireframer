import { Skeleton } from '@/ui/components/skeleton'
import { cn } from '@/lib/utils'

interface CanvasRendererProps {
  isGenerating: boolean
  hasResult: boolean
  gridEnabled: boolean
}

export default function CanvasRenderer({ isGenerating, hasResult, gridEnabled }: CanvasRendererProps) {
  if (isGenerating) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary shadow-glow" />
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
      <div className="mx-auto max-w-5xl rounded-2xl border-2 border-dashed border-primary/40 bg-white/95 p-10 shadow-glow-lg backdrop-blur-sm transition-all duration-500">
        <div className="space-y-8">
          {/* Mock wireframe content */}
          <div className="border-b border-gray-200 pb-5">
            <div className="h-10 w-56 rounded-lg bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4 rounded-xl border border-gray-200 p-5">
              <div className="h-5 w-28 rounded-lg bg-gray-300" />
              <div className="h-24 rounded-lg bg-gray-100" />
            </div>
            <div className="space-y-4 rounded-xl border border-gray-200 p-5">
              <div className="h-5 w-28 rounded-lg bg-gray-300" />
              <div className="h-24 rounded-lg bg-gray-100" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-7">
            <div className="mb-5 h-7 w-36 rounded-lg bg-gray-300" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded-lg bg-gray-100" />
              <div className="h-4 w-5/6 rounded-lg bg-gray-100" />
              <div className="h-4 w-4/6 rounded-lg bg-gray-100" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <div className="h-20 rounded-lg bg-gray-200" />
              <div className="h-3 w-full rounded-lg bg-gray-100" />
            </div>
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <div className="h-20 rounded-lg bg-gray-200" />
              <div className="h-3 w-full rounded-lg bg-gray-100" />
            </div>
            <div className="space-y-3 rounded-xl border border-gray-200 p-4">
              <div className="h-20 rounded-lg bg-gray-200" />
              <div className="h-3 w-full rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-primary/10 border border-primary/30 p-5 text-center shadow-glow-sm">
          <p className="text-sm font-medium text-primary">✓ Wireframe generated successfully</p>
        </div>
      </div>
    </div>
  )
}

