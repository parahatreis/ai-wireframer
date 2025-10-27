import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import AnalysisPanel from '@/components/AnalysisPanel'
import CanvasRenderer from '@/components/CanvasRenderer'
import Toolbar from '@/components/Toolbar'

export default function File() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [isGenerating, setIsGenerating] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [gridEnabled, setGridEnabled] = useState(false)

  // Auto-generate on initial load if prompt exists
  useEffect(() => {
    if (initialPrompt && !hasResult) {
      setIsGenerating(true)
    }
  }, [initialPrompt, hasResult])

  const handleRegenerate = (prompt: string) => {
    setIsGenerating(true)
    setHasResult(false)
    // Update URL with new prompt
    window.history.replaceState({}, '', `/file/${id}?prompt=${encodeURIComponent(prompt)}`)
  }

  const handleComplete = () => {
    setIsGenerating(false)
    setHasResult(true)
  }

  const handleRefine = () => {
    console.log('Refine clicked')
  }

  const handleExport = () => {
    console.log('Export clicked')
  }

  const handleToggleGrid = () => {
    setGridEnabled((prev) => !prev)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-main">
      <AnalysisPanel
        prompt={initialPrompt}
        isGenerating={isGenerating}
        onRegenerate={handleRegenerate}
        onComplete={handleComplete}
      />

      <div className="flex flex-1 flex-col">
        <Toolbar onRefine={handleRefine} onExport={handleExport} onToggleGrid={handleToggleGrid} gridEnabled={gridEnabled} />

        <div className="flex-1 overflow-y-auto">
          <CanvasRenderer isGenerating={isGenerating} hasResult={hasResult} gridEnabled={gridEnabled} />
        </div>
      </div>
    </div>
  )
}

