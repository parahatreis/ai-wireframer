import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shimmer-wrapper rounded-xl bg-muted border border-border', className)}
      {...props}
    />
  )
}

export { Skeleton }

