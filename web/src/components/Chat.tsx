import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Textarea } from '@/theme/components/textarea'
import { Send, Sparkles } from 'lucide-react'
import logo from '../../assets/images/logo.svg'
import type { ConversationMessage } from '@/services/api'

interface ChatProps {
  initialPrompt: string
  onMessageSend: (message: string) => void
  isGenerating: boolean
  conversationHistory: ConversationMessage[]
  detectedPlatform: 'mobile' | 'web'
}

export default function Chat({ initialPrompt, onMessageSend, isGenerating, conversationHistory, detectedPlatform }: ChatProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationHistory, isGenerating])

  const handleSend = () => {
    if (!input.trim() || isGenerating) return

    onMessageSend(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-screen w-full flex-col glass-panel lg:w-[25%]">
      {/* Header */}
      <header className="h-[60px] px-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-white h-[50px] pt-3">
          <img src={logo} alt="Logo" className="h-full" />
        </Link>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4 py-4">
        {conversationHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'glass-panel border-none text-foreground'
                  : 'bg-primary/10 text-foreground border border-primary/20'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">AI Designer</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="glass-panel border border-border rounded-2xl px-4 py-3 min-w-[200px]">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Designing...</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                    <span>Analyzing {detectedPlatform} requirements</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <span>Creating design variations</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span>Optimizing layouts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2">
        <div className="glass-panel rounded-3xl flex items-end p-3 gap-3 h-[100px]">
          {/* Input */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Cloverly..."
            disabled={isGenerating}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="h-10 w-10 rounded-full bg-gray-500 hover:bg-gray-400 disabled:bg-gray-600 disabled:opacity-50 flex items-center justify-center transition-colors shrink-0"
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

