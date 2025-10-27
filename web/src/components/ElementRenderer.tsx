import type { CSSProperties } from 'react'

import type { WireframeElement } from '@/types/wireframe'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

interface ElementRendererProps {
  element: WireframeElement
}

export function ElementRenderer({ element }: ElementRendererProps) {
  const { type, content, styles, attributes, elements } = element
  const style = (styles as CSSProperties) || undefined
  const className = attributes?.class ?? ''

  const children = elements?.map((child, idx) => (
    <ElementRenderer key={`${child.type}-${idx}`} element={child} />
  ))

  switch (type) {
    case 'header':
      return (
        <header className={cn('mb-6 text-3xl font-semibold text-slate-900', className)} style={style}>
          {content}
          {children}
        </header>
      )

    case 'text':
      return (
        <p className={cn('text-base leading-relaxed text-slate-600', className)} style={style}>
          {content}
          {children}
        </p>
      )

    case 'button':
      return (
        <Button
          type={(attributes?.type as 'submit' | 'button' | 'reset') || 'button'}
          className={className}
          style={style}
        >
          {content}
          {children}
        </Button>
      )

    case 'form':
      return (
        <form className={cn('space-y-4', className)} style={style}>
          {children}
        </form>
      )

    case 'input':
      return (
        <Input
          type={attributes?.type || 'text'}
          placeholder={attributes?.placeholder}
          className={className}
          style={style}
        />
      )

    case 'link':
      return (
        <a
          href={attributes?.href || '#'}
          className={cn('text-blue-600 underline hover:text-blue-800', className)}
          style={style}
        >
          {content}
          {children}
        </a>
      )

    case 'image':
      return (
        <img
          src={attributes?.src || 'https://placehold.co/400'}
          alt={attributes?.alt || 'Image'}
          className={cn('h-auto max-w-full rounded-lg border border-slate-200 object-cover', className)}
          style={style}
        />
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
          {content}
          {children}
        </footer>
      )

    case 'section':
      return (
        <section className={cn('rounded-lg border border-slate-100 bg-slate-50/50 p-6', className)} style={style}>
          {content}
          {children}
        </section>
      )

    case 'container':
      return (
        <div className={className} style={style}>
          {content}
          {children}
        </div>
      )

    default:
      return (
        <div className={className} style={style}>
          {content}
          {children}
        </div>
      )
  }
}


