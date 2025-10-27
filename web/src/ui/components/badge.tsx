import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-black shadow-glow-sm hover:shadow-glow',
        secondary: 'border-border glass-panel text-foreground hover:border-primary/50',
        outline: 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

