import type { CSSProperties } from 'react'

import type { WireframeElement } from '@/types/wireframe'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import placeholderImage from '../../assets/images/placeholder.png'
import { LayoutRenderer } from './LayoutRenderer'
import * as LucideIcons from 'lucide-react'
import { Link } from 'react-router-dom'

interface ElementRendererProps {
  element: WireframeElement
}

// Layout element types that should use LayoutRenderer
const LAYOUT_TYPES = ['row', 'column', 'stack', 'grid', 'flex', 'spacer', 'divider']

export function ElementRenderer({ element }: ElementRendererProps) {
  const { type, content, styles, attributes, props, elements } = element
  const typeNormalized = type.toLowerCase()
  
  // Delegate to LayoutRenderer for layout elements
  if (LAYOUT_TYPES.includes(typeNormalized)) {
    return <LayoutRenderer element={element} />
  }
  
  // Map new schema styles to CSS
  const style: CSSProperties = {
    padding: styles?.padding,
    margin: styles?.margin,
    gap: styles?.gap,
    border: styles?.border,
    borderRadius: styles?.borderRadius,
    background: styles?.background,
    color: styles?.color,
  }
  
  const className = cn(
    styles?.tw || '',
    attributes?.className || ''
  )
  
  // Extract text content from new schema
  const textContent = content?.text || ''
  const mediaSrc = placeholderImage;
  const mediaAlt = content?.media?.alt || attributes?.alt

  const children = elements?.map((child, idx) => (
    <ElementRenderer key={`${child.type}-${idx}`} element={child} />
  ))

  switch (typeNormalized) {
    case 'header':
      return (
        <header className={cn('mb-6 text-3xl font-semibold text-slate-900', className)} style={style}>
          {textContent}
          {children}
        </header>
      )

    case 'hero':
      return (
        <div className={cn('space-y-4', className)} style={style}>
          {textContent && <h1 className="text-4xl font-bold md:text-5xl">{textContent}</h1>}
          {children}
        </div>
      )

    case 'text': {
      // Handle different text sizes
      const sizeClasses: Record<string, string> = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      }
      const sizeClass = sizeClasses[props?.size || 'md'] || 'text-base'
      
      return (
        <p className={cn(sizeClass, 'leading-relaxed text-slate-700', className)} style={style}>
          {textContent}
          {children}
        </p>
      )
    }

    case 'button': {
      return (
        <Button
          type={(attributes?.type as 'submit' | 'button' | 'reset') || 'button'}
          className={className}
          style={style}
        >
          {textContent}
          {children}
        </Button>
      )
    }

    case 'form':
      return (
        <form className={cn('space-y-4', className)} style={style}>
          {children}
        </form>
      )

    case 'input':
    case 'textarea':
      return (
        <Input
          type={attributes?.type || 'text'}
          placeholder={attributes?.placeholder}
          aria-label={attributes?.ariaLabel}
          className={className}
          style={style}
        />
      )

    case 'select':
      return (
        <select
          className={cn('rounded-md border border-slate-300 px-3 py-2', className)}
          aria-label={attributes?.ariaLabel}
          style={style}
        >
          {children}
        </select>
      )

    case 'link':
      return (
        <Button
          asChild={true}
          style={style}
          variant="link"
        >
          <Link to={attributes?.href || '#'}>
            {textContent}
            {children}
          </Link>
        </Button>
      )

    case 'icon': {
      // Render lucide-react icons dynamically
      // textContent should be the icon name like "Home", "Search", "User"
      const iconName = textContent || attributes?.id || 'Circle'
      
      // Get icon component from lucide-react
      type LucideIconsType = typeof LucideIcons
      const IconComponent = (LucideIcons as LucideIconsType & Record<string, React.ComponentType<{ className?: string; style?: CSSProperties }>>)[iconName] || LucideIcons.Circle
      
      if (IconComponent === LucideIcons.Circle && iconName !== 'Circle') {
        console.warn(`Icon "${iconName}" not found in lucide-react, using Circle fallback`)
      }
      
      return (
        <IconComponent 
          className={cn('h-5 w-5', className)} 
          style={style}
        />
      )
    }

    case 'image':
      return (
        <img
          src={mediaSrc}
          alt={mediaAlt || 'Image'}
          className={cn('h-auto max-w-full rounded-lg border border-slate-200 object-cover', className)}
          style={style}
        />
      )

    case 'avatar':
      return (
        <div className={cn('inline-block h-10 w-10 overflow-hidden rounded-full', className)} style={style}>
          {mediaSrc ? (
            <img src={mediaSrc} alt={mediaAlt || 'Avatar'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-600">
              {textContent?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      )

    case 'badge':
      return (
        <span className={cn('inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium', className)} style={style}>
          {textContent}
        </span>
      )

    case 'card':
      return (
        <div className={cn('rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow', className)} style={style}>
          {textContent && <h3 className="mb-2 text-lg font-semibold text-slate-900">{textContent}</h3>}
          <div className="space-y-3">
            {children}
          </div>
        </div>
      )

    case 'nav':
      return (
        <nav className={cn('flex flex-wrap items-center gap-4', className)} style={style}>
          {children}
        </nav>
      )

    case 'footer':
      return (
        <footer className={cn('mt-8 border-t border-slate-200 pt-6 text-sm text-slate-500', className)} style={style}>
          {textContent}
          {children}
        </footer>
      )

    case 'list':
      return (
        <div className={cn('space-y-2', className)} style={style}>
          {textContent && <h3 className="mb-3 text-lg font-semibold">{textContent}</h3>}
          {children}
        </div>
      )

    case 'table':
      return (
        <table className={cn('w-full border-collapse', className)} style={style}>
          {children}
        </table>
      )

    case 'tabs':
      return (
        <div className={cn('space-y-4', className)} style={style}>
          {children}
        </div>
      )

    case 'alert':
      return (
        <div className={cn('rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900', className)} style={style}>
          {textContent}
          {children}
        </div>
      )

    case 'emptystate':
      return (
        <div className={cn('py-12 text-center text-slate-500', className)} style={style}>
          {textContent}
          {children}
        </div>
      )

    case 'skeleton':
      return (
        <div className={cn('animate-pulse rounded-md bg-slate-200', className)} style={style}>
          {children}
        </div>
      )

    case 'progress':
      return (
        <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-200', className)} style={style}>
          <div className="h-full bg-blue-600" style={{ width: '50%' }} />
        </div>
      )

    case 'section':
      return (
        <section className={cn('rounded-lg border border-slate-100 bg-slate-50/50 p-6', className)} style={style}>
          {textContent}
          {children}
        </section>
      )

    case 'container':
      return (
        <div className={className} style={style}>
          {textContent}
          {children}
        </div>
      )

    default:
      return (
        <div className={className} style={style}>
          {textContent}
          {children}
        </div>
      )
  }
}


