import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Chat from '@/components/Chat'
import CanvasRenderer from '@/components/CanvasRenderer'
import Toolbar from '@/components/Toolbar'
import { generateWireframe } from '@/services/api'
import type { WireframeResponse } from '@/types/wireframe'

export default function File() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [isGenerating, setIsGenerating] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [gridEnabled, setGridEnabled] = useState(false)
  const [wireframeData, setWireframeData] = useState<WireframeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const hasGeneratedRef = useRef(false)

  const handleGeneration = useCallback(async (prompt: string) => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const result = await generateWireframe({ prompt })
      setWireframeData(result)
      setHasResult(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate wireframe')
      console.error('Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  // Auto-generate on initial load if prompt exists (only once)
  useEffect(() => {
    if (initialPrompt && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true
      handleGeneration(initialPrompt)
    }
  }, [initialPrompt, handleGeneration])

  const handleMessageSend = (message: string) => {
    // Update URL with new prompt
    window.history.replaceState({}, '', `/file/${id}?prompt=${encodeURIComponent(message)}`)
    handleGeneration(message)
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
    <div className="flex h-screen overflow-hidden bg-background">
      <Chat
        initialPrompt={initialPrompt}
        onMessageSend={handleMessageSend}
        isGenerating={isGenerating}
      />
      <div className="flex flex-1 flex-col">
        <Toolbar onRefine={handleRefine} onExport={handleExport} onToggleGrid={handleToggleGrid} gridEnabled={gridEnabled} />
        <div className="flex-1 overflow-y-auto">
          {error ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-4 text-6xl">⚠️</div>
                <h3 className="text-2xl font-semibold text-foreground">Generation Failed</h3>
                <p className="mt-3 text-lg text-muted-foreground">{error}</p>
                <button 
                  onClick={() => handleGeneration(initialPrompt)} 
                  className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <CanvasRenderer 
              isGenerating={isGenerating} 
              hasResult={hasResult} 
              gridEnabled={gridEnabled}
              wireframeData={wireframeData}
            />
          )}
        </div>
      </div>
    </div>
  )
}

