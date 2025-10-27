import type { CSSProperties } from 'react'
import type { WireframeElement } from '@/types/wireframe'
import { ElementRenderer } from './ElementRenderer'
import { cn } from '@/lib/utils'

interface LayoutRendererProps {
  element: WireframeElement
}

/**
 * LayoutRenderer handles layout-specific elements:
 * - Row, Column, Grid, Stack, Flex
 * These create structure without visual styling
 */
export function LayoutRenderer({ element }: LayoutRendererProps) {
  const { type, styles, attributes, elements } = element
  const typeNormalized = type.toLowerCase()

  const style: CSSProperties = {
    padding: styles?.padding,
    margin: styles?.margin,
    gap: styles?.gap,
    background: styles?.background,
  }

  const className = cn(styles?.tw || '', attributes?.className || '')

  const children = elements?.map((child, idx) => (
    <ElementRenderer key={idx} element={child} />
  ))

  switch (typeNormalized) {
    case 'row':
      return (
        <div className={cn('flex flex-row items-center gap-4', className)} style={style}>
          {children}
        </div>
      )

    case 'column':
    case 'stack':
      return (
        <div className={cn('flex flex-col gap-4', className)} style={style}>
          {children}
        </div>
      )

    case 'grid': {
      // Parse grid columns from styles or default to auto-fit
      const gridCols = styles?.tw?.match(/grid-cols-(\d+)/)
      const cols = gridCols ? gridCols[1] : '3'
      return (
        <div
          className={cn(`grid grid-cols-1 gap-4 md:grid-cols-${cols}`, className)}
          style={style}
        >
          {children}
        </div>
      )
    }

    case 'flex':
      return (
        <div className={cn('flex flex-wrap gap-4', className)} style={style}>
          {children}
        </div>
      )

    case 'spacer':
      return <div className={cn('flex-1', className)} style={style} />

    case 'divider':
      return <hr className={cn('border-t border-slate-200', className)} style={style} />

    default:
      return (
        <div className={className} style={style}>
          {children}
        </div>
      )
  }
}

