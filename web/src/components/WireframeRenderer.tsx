import type { WireframeResponse } from '@/types/wireframe'
import { PanZoomWorkspace } from './workspace/PanZoomWorkspace'

interface WireframeRendererProps {
  data?: WireframeResponse | null
}

export default function WireframeRenderer({ data }: WireframeRendererProps) {
  if (!data || !data.pages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No pages to render
      </div>
    )
  }

  const pages = data.pages.map((page, index) => ({
    id: `page-${index}`,
    name: page.name || `Page ${index + 1}`,
    description: page.description,
    elements: page.elements,
    x: (index % 2) * 960,
    y: Math.floor(index / 2) * 820,
    w: 880,
    h: 640,
  }))

  return (
    <div className="h-full min-h-[720px]">
      <PanZoomWorkspace
        pages={pages}
        initialTransform={{ x: 160, y: 160, scale: 0.6 }}
      />
    </div>
  )
}

