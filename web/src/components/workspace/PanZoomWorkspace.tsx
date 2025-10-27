import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { PageBoard } from './PageBoard'
import type { WorkspacePage, WorkspaceTransform } from './types'

const GRID_SIZE = 40
const MIN_SCALE = 0.5
const MAX_SCALE = 2
const ZOOM_SENSITIVITY = 0.002

interface PanZoomWorkspaceProps {
  width?: number
  height?: number
  pages?: WorkspacePage[]
  initialTransform?: WorkspaceTransform
}

export function PanZoomWorkspace({
  width = 5000,
  height = 5000,
  pages,
  initialTransform = { x: 120, y: 120, scale: 0.7 },
}: PanZoomWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState<WorkspaceTransform>(initialTransform)
  const isPanningRef = useRef(false)
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null)

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

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[640px] w-full overflow-hidden cursor-grab"
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
          width,
          height,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
        }}
      >
        {pages?.map((page: WorkspacePage) => (
          <PageBoard key={page.id} page={page} />
        ))}
      </div>
    </div>
  )
}


