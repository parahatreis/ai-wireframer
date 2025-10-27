import { Button } from '@/ui/components/button'
import { Input } from '@/ui/components/input'
import type { WireframeResponse, WireframeElement } from '@/types/wireframe'

interface WireframeRendererProps {
  data: WireframeResponse
}

interface ElementRendererProps {
  element: WireframeElement
}

function ElementRenderer({ element }: ElementRendererProps) {
  const { type, content, styles, attributes, elements } = element
  
  // Convert styles object to React style object
  const styleProps = styles ? { style: styles } : {}
  
  // Build className from attributes
  const className = attributes?.class || ''
  
  // Render nested elements
  const children = elements?.map((child, idx) => (
    <ElementRenderer key={idx} element={child} />
  ))

  switch (type) {
    case 'header':
      return (
        <header className={`text-3xl font-bold mb-6 text-black ${className}`} {...styleProps}>
          {content}
          {children}
        </header>
      )
    
    case 'text':
      return (
        <p className={`text-base text-gray-700 ${className}`} {...styleProps}>
          {content}
          {children}
        </p>
      )
    
    case 'button':
      return (
        <Button
          type={(attributes?.type as 'submit' | 'button' | 'reset') || 'button'}
          className={className}
          {...styleProps}
        >
          {content}
          {children}
        </Button>
      )
    
    case 'form':
      return (
        <form className={`space-y-4 ${className}`} {...styleProps}>
          {children}
        </form>
      )
    
    case 'input':
      return (
        <Input
          type={attributes?.type || 'text'}
          placeholder={attributes?.placeholder}
          className={className}
          {...styleProps}
        />
      )
    
    case 'link':
      return (
        <a 
          href={attributes?.href || '#'} 
          className={`text-blue-600 hover:text-blue-800 underline ${className}`}
          {...styleProps}
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
          className={`max-w-full h-auto rounded-lg border border-gray-300 ${className}`}
          {...styleProps}
        />
      )
    
    case 'nav':
      return (
        <nav className={`flex gap-6 items-center ${className}`} {...styleProps}>
          {children}
        </nav>
      )
    
    case 'footer':
      return (
        <footer className={`mt-8 pt-6 border-t border-gray-300 text-gray-600 ${className}`} {...styleProps}>
          {content}
          {children}
        </footer>
      )
    
    case 'section':
      return (
        <section className={`mb-8 ${className}`} {...styleProps}>
          {children}
        </section>
      )
    
    case 'container':
    default:
      return (
        <div className={`${className}`} {...styleProps}>
          {content}
          {children}
        </div>
      )
  }
}

export default function WireframeRenderer({ data }: WireframeRendererProps) {
  const { pages } = data

  if (!pages || pages.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No pages to render
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {pages.map((page, pageIdx) => (
        <div key={pageIdx} className="space-y-6">
          {page.name && (
            <h2 className="text-2xl font-semibold border-b border-gray-300 pb-2 text-black">
              {page.name}
            </h2>
          )}
          {page.description && (
            <p className="text-gray-600 text-sm">{page.description}</p>
          )}
          <div className="space-y-6">
            {page.elements.map((element, elemIdx) => (
              <ElementRenderer key={elemIdx} element={element} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

