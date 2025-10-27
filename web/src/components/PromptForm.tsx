import { useState, useEffect } from 'react'
import { Textarea } from '@/ui/components/textarea'
import { Button } from '@/ui/components/button'

interface PromptFormProps {
  initialPrompt: string
  onRegenerate: (prompt: string) => void
  isGenerating: boolean
}

export default function PromptForm({ initialPrompt, onRegenerate, isGenerating }: PromptFormProps) {
  const [prompt, setPrompt] = useState(initialPrompt)

  useEffect(() => {
    setPrompt(initialPrompt)
  }, [initialPrompt])

  const handleRegenerate = () => {
    if (prompt.trim()) {
      onRegenerate(prompt)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-3 block text-sm font-medium text-foreground">Your Prompt</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your wireframe..."
          className="min-h-[140px]"
        />
      </div>
      <Button onClick={handleRegenerate} disabled={!prompt.trim() || isGenerating} className="w-full font-medium">
        {isGenerating ? 'Generating...' : 'Regenerate'}
      </Button>
    </div>
  )
}

