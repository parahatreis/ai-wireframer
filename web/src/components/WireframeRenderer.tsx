import type { WireframeMeta, WireframeResponse } from '@/types/wireframe'
import { PanZoomWorkspace } from './workspace/PanZoomWorkspace'
import { validateWireframe, isValidWireframe } from '@/utils/wireframeValidator'

interface WireframeRendererProps {
  data?: WireframeResponse | null
}

// Canvas rendering sizes for different platforms
const WEB_CANVAS_WIDTH = 1200
const MOBILE_CANVAS_WIDTH = 375
const MIN_BOARD_HEIGHT = 400

// Standard viewport aspect ratios
const STANDARD_VIEWPORTS = {
  mobile: { width: 390, height: 844 }, // iPhone 12/13/14
  web: { width: 1440, height: 900 }, // Common desktop
}

function parseViewport(meta: WireframeMeta): { width: number; height: number } {
  const platforms = meta.platforms || [meta.platform]
  const isMobile = platforms?.includes('mobile')
  const fallback = isMobile ? STANDARD_VIEWPORTS.mobile : STANDARD_VIEWPORTS.web

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
  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No data to render
      </div>
    )
  }

  // Validate and normalize data
  if (!isValidWireframe(data)) {
    console.error('Invalid wireframe data:', data)
    return (
      <div className="flex h-full items-center justify-center text-red-500">
        Invalid wireframe data structure
      </div>
    )
  }

  const validatedData = validateWireframe(data)

  if (!validatedData.pages || validatedData.pages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No pages to render
      </div>
    )
  }

  const viewport = parseViewport(validatedData.meta)
  const platforms = validatedData.meta.platforms || [validatedData.meta.platform]
  const platform = platforms?.includes('mobile') ? 'mobile' : 'web'
  
  // Calculate canvas size based on viewport aspect ratio
  const viewportAspectRatio = viewport.height / viewport.width
  const canvasWidth = platform === 'mobile' ? MOBILE_CANVAS_WIDTH : WEB_CANVAS_WIDTH
  const canvasHeight = Math.max(
    Math.round(canvasWidth * viewportAspectRatio),
    MIN_BOARD_HEIGHT
  )
  
  // Board dimensions
  const boardWidth = canvasWidth
  const boardHeight = canvasHeight
  const columnSpacing = boardWidth + 120
  const rowSpacing = boardHeight + 160

  const pages = validatedData.pages.map((page, index) => {
    // Flatten sections into elements for backward compatibility
    const elements = page.sections?.flatMap(section => section.elements) || []
    
    return {
      id: `page-${index}`,
      name: page.name || `Page ${index + 1}`,
      description: page.purpose,
      sections: page.sections,
      elements,
      platform: platform as 'mobile' | 'web', // Pass platform info to pages
      x: (index % 2) * columnSpacing,
      y: Math.floor(index / 2) * rowSpacing,
      w: boardWidth,
      h: boardHeight,
    }
  })

  return (
    <div className="h-full min-h-[720px]">
      <PanZoomWorkspace
        pages={pages}
        initialTransform={{ x: 160, y: 160, scale: platform === 'mobile' ? 1 : 0.5 }}
      />
    </div>
  )
}

