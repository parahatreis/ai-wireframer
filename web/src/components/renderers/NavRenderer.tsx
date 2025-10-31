import type { Section, Theme } from '@/types/wireframe'
import * as LucideIcons from 'lucide-react'

interface NavRendererProps {
  section: Section
  theme: Theme
  platform?: 'web' | 'mobile'
}

/**
 * NavRenderer: Navigation bar
 * - Web: Horizontal top bar with logo + links
 * - Mobile: Bottom tab bar with icons + labels
 */
export function NavRenderer({ section, theme, platform = 'web' }: NavRendererProps) {
  const content = section.content || {}
  const brand = content.brand || 'App'
  const items = (content.items as string[]) || []

  // Mobile: Bottom tab bar
  if (platform === 'mobile') {
    return (
      <nav 
        className="fixed bottom-0 left-0 right-0 z-10 border-t px-4 py-3"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        }}
      >
        <div className="flex items-center justify-around">
          {items.map((item, idx) => {
            // Get icon from lucide-react
            const IconComponent = (LucideIcons as any)[item] || LucideIcons.Circle
            
            return (
              <button
                key={idx}
                className="flex flex-col items-center gap-0.5 px-3 py-1"
                style={{ color: theme.colors.foreground }}
              >
                <IconComponent className="h-5 w-5" />
                <span 
                  className="text-xs"
                  style={{ fontSize: `${theme.typography.small}px` }}
                >
                  {item}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    )
  }

  // Web: Horizontal top bar
  return (
    <header
      className="sticky top-0 z-10 border-b px-6 py-4"
      style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border,
      }}
    >
      <div className="flex items-center justify-between">
        <div 
          className="font-bold"
          style={{
            color: theme.colors.foreground,
            fontSize: `${theme.typography.h3}px`,
          }}
        >
          {brand}
        </div>
        
        <nav className="flex items-center gap-6">
          {items.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className="transition-colors hover:opacity-80"
              style={{
                color: theme.colors.foreground,
                fontSize: `${theme.typography.body}px`,
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

