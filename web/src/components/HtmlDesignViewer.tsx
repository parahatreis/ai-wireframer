import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { Download, ZoomIn, ZoomOut, Sparkles } from 'lucide-react'
import { Button } from '@/theme/components/button'
import type { PageDesign } from '@/services/api'

interface HtmlDesignViewerProps {
  pages: PageDesign[]
  isGenerating: boolean
  platform: 'mobile' | 'web'
}

const GRID_SIZE = 40
const MIN_SCALE = 0.1
const MAX_SCALE = 2
const ZOOM_SENSITIVITY = 0.002
const ZOOM_STEP = 0.1
const FRAME_GAP = 200 // Gap between frames in pixels

interface Transform {
  x: number
  y: number
  scale: number
}

// Platform-specific viewport sizes
const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  web: { width: 1440, height: 900 },
}

export default function HtmlDesignViewer({ pages, isGenerating, platform }: HtmlDesignViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>({ x: 120, y: 120, scale: 0.5 })
  const isPanningRef = useRef(false)
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

  const viewport = VIEWPORT_SIZES[platform]

  const handleWheel = useCallback((event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault()
    }
    event.preventDefault()
    event.stopPropagation()

    const container = containerRef.current
    if (!container) return

    setTransform((prev) => {
      const desiredScale = prev.scale - event.deltaY * ZOOM_SENSITIVITY
      const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, desiredScale))

      if (clampedScale === prev.scale) {
        return prev
      }

      const rect = container.getBoundingClientRect()
      const offsetX = event.clientX - rect.left
      const offsetY = event.clientY - rect.top

      const workspaceX = (offsetX - prev.x) / prev.scale
      const workspaceY = (offsetY - prev.y) / prev.scale

      const nextX = offsetX - workspaceX * clampedScale
      const nextY = offsetY - workspaceY * clampedScale

      return {
        x: nextX,
        y: nextY,
        scale: clampedScale,
      }
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const listener = (event: WheelEvent) => {
      handleWheel(event)
    }

    container.addEventListener('wheel', listener, { passive: false })

    return () => {
      container.removeEventListener('wheel', listener)
    }
  }, [handleWheel])

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.preventDefault()
    isPanningRef.current = true
    lastPositionRef.current = { x: event.clientX, y: event.clientY }
  }, [])

  const handleMouseUp = useCallback(() => {
    isPanningRef.current = false
    lastPositionRef.current = null
  }, [])

  const handleMouseLeave = handleMouseUp

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanningRef.current || !lastPositionRef.current) return

    const deltaX = event.clientX - lastPositionRef.current.x
    const deltaY = event.clientY - lastPositionRef.current.y

    setTransform((prev) => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }))
    lastPositionRef.current = { x: event.clientX, y: event.clientY }
  }, [])

  const backgroundStyle = useMemo(() => {
    const adjustedGrid = GRID_SIZE * transform.scale
    const backgroundSize = `${adjustedGrid}px ${adjustedGrid}px`
    const backgroundPosition = `${transform.x}px ${transform.y}px`

    return {
      backgroundSize,
      backgroundPosition,
    }
  }, [transform])

  const handleZoomIn = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(MAX_SCALE, prev.scale + ZOOM_STEP),
    }))
  }

  const handleZoomOut = () => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(MIN_SCALE, prev.scale - ZOOM_STEP),
    }))
  }

  const handleDownloadAll = () => {
    pages.forEach((page, index) => {
      const blob = new Blob([page.html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  if (isGenerating) {
    return (
      <div className="flex h-full items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center space-y-6">
          {/* Animated Logo/Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute h-24 w-24 rounded-full bg-primary/20 animate-ping"></div>
            <div className="absolute h-20 w-20 rounded-full bg-primary/30 animate-pulse"></div>
            <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="space-y-3 min-w-[280px]">
            <h3 className="text-lg font-semibold text-foreground">Creating Your Design</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <span>Analyzing requirements</span>
              </div>
              <div className="flex items-center gap-3 justify-center" style={{ animationDelay: '0.2s' }}>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span>Designing pages</span>
              </div>
              <div className="flex items-center gap-3 justify-center" style={{ animationDelay: '0.4s' }}>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span>Perfecting details</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-primary/60 animate-[loading_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
        
        <style>{`
          @keyframes loading {
            0%, 100% { width: 0%; margin-left: 0%; }
            50% { width: 100%; margin-left: 0%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    )
  }

  if (!pages || pages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 text-6xl">🎨</div>
          <h3 className="text-2xl font-semibold">No Designs Yet</h3>
          <p className="mt-2 text-muted-foreground">Start by describing what you want to create</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-muted/20">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} • {platform === 'mobile' ? 'Mobile' : 'Web'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border-r pr-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={transform.scale <= MIN_SCALE}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[45px] text-center">
              {Math.round(transform.scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={transform.scale >= MAX_SCALE}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Actions */}
          <Button variant="outline" size="sm" onClick={handleDownloadAll}>
            <Download className="h-4 w-4 mr-1" />
            Download All
          </Button>
        </div>
      </div>

      {/* Figma-Style Canvas with Multiple Frames */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 bg-[#f3f4f6]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
            ...backgroundStyle,
          }}
        />
        <div
          className="absolute"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Render all frames horizontally */}
          {pages.map((page, index) => {
            const xPos = index * (viewport.width + FRAME_GAP)
            
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: `${xPos}px`,
                  top: 0,
                }}
              >
                {/* Frame Label */}
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-sm font-semibold text-accent-foreground bg-white px-3 py-1 rounded-md shadow-sm border border-border">
                    {index + 1}. {page.name}
                  </span>
                  <span className="text-xs text-accent-foreground bg-white px-2 py-1 rounded border border-border">
                    {viewport.width} × {viewport.height}
                  </span>
                </div>
                
                {/* Frame */}
                <div 
                  className="rounded-lg border-2 border-border bg-white shadow-2xl overflow-hidden"
                  style={{ width: `${viewport.width}px`, height: `${viewport.height}px` }}
                >
                  <iframe
                    srcDoc={page.html}
                    className="w-full h-full border-0"
                    title={page.name}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
