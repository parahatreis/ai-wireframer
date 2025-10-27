import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ProgressMessage {
  id: number
  text: string
  completed: boolean
}

const progressSteps = [
  'Analyzing prompt…',
  'Extracting layout components…',
  'Planning structure…',
  'Building wireframe…',
  'Finalizing design…',
]

interface ProgressFeedProps {
  isGenerating: boolean
  onComplete: () => void
}

export default function ProgressFeed({ isGenerating, onComplete }: ProgressFeedProps) {
  const [messages, setMessages] = useState<ProgressMessage[]>([])

  useEffect(() => {
    if (!isGenerating) {
      setMessages([])
      return
    }

    // Reset messages when generation starts
    setMessages([])

    // Simulate progress with timeouts
    const timeouts: NodeJS.Timeout[] = []

    progressSteps.forEach((step, index) => {
      const timeout = setTimeout(
        () => {
          setMessages((prev) => [...prev, { id: index, text: step, completed: false }])

          // Mark as completed after a brief moment
          setTimeout(() => {
            setMessages((prev) => prev.map((msg) => (msg.id === index ? { ...msg, completed: true } : msg)))

            // Call onComplete when all steps are done
            if (index === progressSteps.length - 1) {
              setTimeout(() => {
                onComplete()
              }, 500)
            }
          }, 400)
        },
        index * 800 + 300
      )
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [isGenerating, onComplete])

  if (messages.length === 0) {
    return (
      <div className="rounded-xl glass-panel border-dashed p-5 text-center text-sm text-muted-foreground">
        AI analysis will appear here
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">AI Analysis</h3>
      <div className="space-y-2.5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3 rounded-xl border p-4 text-sm transition-all duration-300 animate-fade-in',
              message.completed 
                ? 'border-primary/50 bg-primary/10 text-foreground shadow-glow-sm' 
                : 'border-border glass-panel text-muted-foreground'
            )}
          >
            <span
              className={cn(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-all duration-300',
                message.completed 
                  ? 'bg-primary text-primary-foreground shadow-glow-sm' 
                  : 'border-2 border-border'
              )}
            >
              {message.completed && '✓'}
            </span>
            <span className="font-medium">{message.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

