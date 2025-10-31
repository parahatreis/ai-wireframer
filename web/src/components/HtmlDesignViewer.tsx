import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { ChevronLeft, ChevronRight, Download, ExternalLink, Monitor, Tablet, Smartphone, Sparkles } from 'lucide-react'
import { Button } from '@/theme/components/button'

interface HtmlDesignViewerProps {
  designs: string[]
  isGenerating: boolean
  initialViewport?: ViewportType
}

const GRID_SIZE = 40
const MIN_SCALE = 0.3
const MAX_SCALE = 1.5
const ZOOM_SENSITIVITY = 0.002

interface Transform {
  x: number
  y: number
  scale: number
}

type ViewportType = 'desktop' | 'tablet' | 'mobile'

interface Viewport {
  width: number
  height: number
  label: string
  icon: typeof Monitor
}

const VIEWPORTS: Record<ViewportType, Viewport> = {
  desktop: { width: 1440, height: 900, label: 'Desktop', icon: Monitor },
  tablet: { width: 768, height: 1024, label: 'Tablet', icon: Tablet },
  mobile: { width: 375, height: 667, label: 'Mobile', icon: Smartphone },
}

export default function HtmlDesignViewer({ designs, isGenerating, initialViewport = 'desktop' }: HtmlDesignViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewport, setViewport] = useState<ViewportType>(initialViewport)
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<Transform>({ x: 120, y: 120, scale: 0.7 })
  const isPanningRef = useRef(false)
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

  const currentDesign = designs[currentIndex] || ''
  const currentViewport = VIEWPORTS[viewport]

  // Update viewport when initialViewport changes (new generation with different platform)
  useEffect(() => {
    setViewport(initialViewport)
  }, [initialViewport])

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

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : designs.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < designs.length - 1 ? prev + 1 : 0))
  }

  const handleDownload = () => {
    const blob = new Blob([currentDesign], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `design-${currentIndex + 1}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleOpenInNewTab = () => {
    const blob = new Blob([currentDesign], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
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
                <span>Designing variations</span>
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

  if (!designs || designs.length === 0) {
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
          {/* Viewport Selector */}
          <div className="flex items-center gap-1 border-l pl-3">
            {(Object.keys(VIEWPORTS) as ViewportType[]).map((key) => {
              const vp = VIEWPORTS[key]
              const Icon = vp.icon
              return (
                <Button
                  key={key}
                  variant={viewport === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewport(key)}
                  className="gap-1.5"
                  title={`${vp.label} (${vp.width}×${vp.height})`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{vp.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={designs.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={designs.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Actions */}
          <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* Pan-Zoom Canvas */}
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
          <div 
            className="rounded-lg border-2 border-border bg-white shadow-2xl overflow-hidden"
            style={{ width: `${currentViewport.width}px`, height: `${currentViewport.height}px` }}
          >
            <iframe
              srcDoc={currentDesign}
              className="w-full h-full border-0"
              title={`Design variation ${currentIndex + 1}`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

