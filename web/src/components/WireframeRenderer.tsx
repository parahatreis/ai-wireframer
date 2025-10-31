import type { GenerateResponse } from '@/types/wireframe'
import { PanZoomWorkspace } from './workspace/PanZoomWorkspace'
import { ThemeProvider } from './ThemeProvider'

interface WireframeRendererProps {
  data?: GenerateResponse | null
}

// Canvas rendering sizes
const WEB_CANVAS_WIDTH = 1200
const MOBILE_CANVAS_WIDTH = 375
const MIN_BOARD_HEIGHT = 800

/**
 * WireframeRenderer: Main renderer for NEW_FLOW UI specs
 * Wraps pages in ThemeProvider and renders with PanZoomWorkspace
 */
export default function WireframeRenderer({ data }: WireframeRendererProps) {
  if (!data || !data.spec) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        No data to render
      </div>
    )
  }

  const { spec } = data
  
  // Validate spec structure
  if (!spec.pages || spec.pages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        No pages to render
      </div>
    )
  }

  const platform = (spec.meta.platform || 'web') as 'web' | 'mobile'
  
  // Map spec pages to workspace pages format
  const pages = spec.pages.map((page, index) => {
    const canvasWidth = platform === 'mobile' ? MOBILE_CANVAS_WIDTH : WEB_CANVAS_WIDTH
    const canvasHeight = MIN_BOARD_HEIGHT
    console.log('page', page)
    const meta = page.meta ?? {}
    const pageTitle = meta.title || `Page ${index + 1}`
    const pageDescription = meta.description || ''
    
    return {
      id: `page-${index}`,
      name: pageTitle,
      description: pageDescription,
      route: page.route,
      sections: page.sections,
      platform: platform,
      x: (index % 2) * (canvasWidth + 120), // Horizontal spacing
      y: Math.floor(index / 2) * (canvasHeight + 160), // Vertical spacing
      w: canvasWidth,
      h: canvasHeight,
    }
  })

  return (
    <ThemeProvider theme={spec.theme}>
      <div className="h-full min-h-[720px]">
        <PanZoomWorkspace
          pages={pages}
          initialTransform={{
            x: 160,
            y: 160,
            scale: platform === 'mobile' ? 1 : 0.5,
          }}
        />
      </div>
    </ThemeProvider>
  )
}
