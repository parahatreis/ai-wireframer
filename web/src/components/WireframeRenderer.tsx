import type { WireframeMeta, WireframeResponse } from '@/types/wireframe'
import { PanZoomWorkspace } from './workspace/PanZoomWorkspace'

interface WireframeRendererProps {
  data?: WireframeResponse | null
}

const WEB_BASE_WIDTH = 960
const MOBILE_BASE_WIDTH = 420
const MIN_BOARD_HEIGHT = 520

function parseViewport(meta: WireframeMeta): { width: number; height: number } {
  const fallbackPlatform = meta.platform === 'mobile' ? 'mobile' : 'web'
  const fallback = fallbackPlatform === 'mobile'
    ? { width: 390, height: 844 }
    : { width: 1440, height: 1024 }

  if (!meta.viewport) {
    return fallback
  }

  const match = meta.viewport.match(/(\d{2,4})\s*[x×]\s*(\d{2,4})/i)
  if (!match) {
    return fallback
  }

  const width = Number(match[1]) || fallback.width
  const height = Number(match[2]) || fallback.height

  if (width <= 0 || height <= 0) {
    return fallback
  }

  return { width, height }
}

export default function WireframeRenderer({ data }: WireframeRendererProps) {
  if (!data || !data.pages?.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No pages to render
      </div>
    )
  }

  const viewport = parseViewport(data.meta)
  const platform = data.meta.platform === 'mobile' ? 'mobile' : 'web'
  const baseWidth = platform === 'mobile' ? MOBILE_BASE_WIDTH : WEB_BASE_WIDTH
  const aspectRatio = viewport.height / viewport.width
  const boardWidth = baseWidth
  const rawHeight = baseWidth * aspectRatio
  const boardHeight = Math.max(Math.round(rawHeight), MIN_BOARD_HEIGHT)
  const columnSpacing = boardWidth + 120
  const rowSpacing = boardHeight + 160

  const pages = data.pages.map((page, index) => ({
    id: `page-${index}`,
    name: page.name || `Page ${index + 1}`,
    description: page.description,
    elements: page.elements,
    x: (index % 2) * columnSpacing,
    y: Math.floor(index / 2) * rowSpacing,
    w: boardWidth,
    h: boardHeight,
  }))

  return (
    <div className="h-full min-h-[720px]">
      <PanZoomWorkspace
        pages={pages}
        initialTransform={{ x: 160, y: 160, scale: platform === 'mobile' ? 0.8 : 0.6 }}
      />
    </div>
  )
}

