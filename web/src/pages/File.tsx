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
  const [hasResult, setHasResult] = useState(true)
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

  useEffect(() => {
    if (initialPrompt && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true
      handleGeneration(initialPrompt)
    }
  }, [initialPrompt, handleGeneration])

  const handleMessageSend = (message: string) => {
    window.history.replaceState({}, '', `/file/${id}?prompt=${encodeURIComponent(message)}`)
    handleGeneration(message)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Chat
        initialPrompt={initialPrompt}
        onMessageSend={handleMessageSend}
        isGenerating={isGenerating}
        plannedMessage={wireframeData?.meta?.planned ? { id: wireframeData.meta.title || 'latest', content: wireframeData.meta.planned } : null}
      />
      <div className="flex flex-1 flex-col justify-end min-h-0">
        <Toolbar />
        <div className="flex-1 overflow-hidden min-h-0">
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
              wireframeData={wireframeData}
            />
          )}
        </div>
      </div>
    </div>
  )
}

