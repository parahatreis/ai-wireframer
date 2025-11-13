import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import Chat from '@/components/Chat'
import HtmlDesignViewer from '@/components/HtmlDesignViewer'
import { generateHtmlDesigns, type ConversationMessage, type PageDesign } from '@/services/api'
import { Button } from '@/theme/components/button'

export default function File() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialPrompt = searchParams.get('prompt') || ''

  const [isGenerating, setIsGenerating] = useState(false)
  const [pages, setPages] = useState<PageDesign[]>([])
  const [error, setError] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [detectedPlatform, setDetectedPlatform] = useState<'mobile' | 'web'>('web')
  const hasGeneratedRef = useRef(false)

  const handleGeneration = useCallback(async (prompt: string) => {
    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateHtmlDesigns({ 
        prompt,
        num_variations: 3,
        conversation_history: conversationHistory.length > 0 ? conversationHistory : undefined
      })
      
      console.log('HTML pages generated:', result.count, 'Platform:', result.platform)
      setPages(result.pages)
      setDetectedPlatform(result.platform)
      setConversationHistory(result.conversation)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate HTML designs')
      console.error('Generation error:', err)
      
      // Remove the optimistic message on error
      setConversationHistory(prev => prev.slice(0, -1))
    } finally {
      setIsGenerating(false)
    }
  }, [conversationHistory])

  useEffect(() => {
    if (initialPrompt && !hasGeneratedRef.current) {
      hasGeneratedRef.current = true
      // Add initial prompt to conversation history
      setConversationHistory([{ role: 'user', content: initialPrompt }])
      handleGeneration(initialPrompt)
    }
  }, [initialPrompt, handleGeneration])

  const handleMessageSend = (message: string) => {
    // Add user message optimistically to conversation history
    setConversationHistory(prev => [...prev, { role: 'user', content: message }])
    
    window.history.replaceState({}, '', `/file/${id}?prompt=${encodeURIComponent(message)}`)
    handleGeneration(message)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Chat
        initialPrompt={initialPrompt}
        onMessageSend={handleMessageSend}
        isGenerating={isGenerating}
        conversationHistory={conversationHistory}
        detectedPlatform={detectedPlatform}
      />
      <div className="flex flex-1 flex-col justify-end min-h-0">
        <div className="flex-1 overflow-hidden min-h-0">
          {error ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-4 text-6xl">⚠️</div>
                <h3 className="text-2xl font-semibold text-foreground">Generation Failed</h3>
                <p className="mt-3 text-lg text-muted-foreground mb-3">{error}</p>
                <Button
                  onClick={() => handleGeneration(initialPrompt)}
                  variant="outline"
                  size="default"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <HtmlDesignViewer
              pages={pages}
              isGenerating={isGenerating}
              platform={detectedPlatform}
            />
          )}
        </div>
      </div>
    </div>
  )
}

