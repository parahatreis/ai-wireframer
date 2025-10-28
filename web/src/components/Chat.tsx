import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Textarea } from '@/theme/components/textarea'
import { Send, Loader2, Wrench, Palette, Sparkles, Construction, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react'
import logo from '../../assets/images/logo.svg'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolCalls?: {
    id: string
    type: string
    function: {
      name: string
      arguments: string
    }
  }[]
}

interface ChatProps {
  initialPrompt: string
  onMessageSend: (message: string) => void
  isGenerating: boolean
  plannedMessage?: {
    id: string
    content: string
  } | null
}

export default function Chat({ initialPrompt, onMessageSend, isGenerating, plannedMessage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fake tool calls for demonstration
  const fakeToolCalls = [
    {
      id: 'tool-1',
      type: 'function',
      function: {
        name: 'discuss_layout',
        arguments: JSON.stringify({
          pages: [
            { name: 'Home', route: '/', purpose: 'Landing page', sections: ['header', 'hero', 'content'], priority: 'high' },
            { name: 'Dashboard', route: '/dashboard', purpose: 'Main view', sections: ['header', 'content'], priority: 'high' }
          ],
          navigation: { type: 'horizontal', items: ['Home', 'Dashboard', 'Settings'] },
          reasoning: 'Clean layout with clear navigation flow'
        })
      }
    },
    {
      id: 'tool-2',
      type: 'function',
      function: {
        name: 'decide_theme',
        arguments: JSON.stringify({
          colors: { primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' },
          typography: { heading: 'Inter', body: 'Inter' },
          mood: 'professional',
          reasoning: 'Modern, clean aesthetic'
        })
      }
    },
    {
      id: 'tool-3',
      type: 'function',
      function: {
        name: 'configure_motion',
        arguments: JSON.stringify({
          defaults: { duration: '200ms', easing: 'ease-out' },
          interactions: { hover: 'lift-sm', press: 'scale-98' },
          reasoning: 'Subtle, performance-focused animations'
        })
      }
    },
    {
      id: 'tool-4',
      type: 'function',
      function: {
        name: 'build_wireframe',
        arguments: JSON.stringify({
          meta: { title: 'App Design', platforms: ['web'] },
          pages: '... (complete wireframe structure)'
        })
      }
    }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with user prompt
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'user',
          content: initialPrompt,
          timestamp: new Date(),
        }
      ])
    }
  }, [initialPrompt, messages.length])

  // Show fake thinking steps when generation completes
  useEffect(() => {
    if (!isGenerating && plannedMessage?.content && messages.length > 0) {
      // Check if we already have the assistant message
      const hasAssistantMessage = messages.some(m => m.role === 'assistant')
      if (!hasAssistantMessage) {
        setMessages(prev => [...prev, {
          id: '2',
          role: 'assistant',
          content: 'I analyzed your request and created the design through these steps:',
          timestamp: new Date(),
          toolCalls: fakeToolCalls
        }])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenerating, plannedMessage, messages.length])

  const handleSend = () => {
    if (!input.trim() || isGenerating) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    onMessageSend(input)
    setInput('')

  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleToolExpansion = (toolId: string) => {
    setExpandedTools(prev => {
      const newSet = new Set(prev)
      if (newSet.has(toolId)) {
        newSet.delete(toolId)
      } else {
        newSet.add(toolId)
      }
      return newSet
    })
  }

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'discuss_layout':
        return <Wrench className="h-4 w-4" />
      case 'decide_theme':
        return <Palette className="h-4 w-4" />
      case 'configure_motion':
        return <Sparkles className="h-4 w-4" />
      case 'build_wireframe':
        return <Construction className="h-4 w-4" />
      default:
        return <Wrench className="h-4 w-4" />
    }
  }

  const getToolLabel = (toolName: string) => {
    switch (toolName) {
      case 'discuss_layout':
        return 'Analyzing layout requirements...'
      case 'decide_theme':
        return 'Deciding on theme...'
      case 'configure_motion':
        return 'Configuring motion...'
      case 'build_wireframe':
        return 'Building final wireframe...'
      default:
        return 'Processing...'
    }
  }

  const renderToolCalls = (toolCalls: Message['toolCalls'], messageId: string) => {
    if (!toolCalls) return null
    return (
      <div className="mt-2 space-y-2">
        {toolCalls.map((toolCall, index) => {
          const toolId = `${messageId}-${index}`
          const isExpanded = expandedTools.has(toolId)
          const toolName = toolCall.function?.name || 'unknown'
          
          return (
            <div key={toolId} className="glass-panel rounded-lg p-2 border border-border/50">
              <button
                onClick={() => toggleToolExpansion(toolId)}
                className="w-full flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 flex-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {getToolIcon(toolName)}
                  <span className="text-xs text-muted-foreground">{getToolLabel(toolName)}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </button>
              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(JSON.parse(toolCall.function?.arguments || '{}'), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
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
      <div className="flex-1 overflow-y-auto px-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-2 py-1 ${
                message.role === 'user'
                  ? 'glass-panel border-none text-foreground'
                  : 'bg-transparent text-foreground'
              }`}
            >
              {message.content && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
              {message.toolCalls && message.toolCalls.length > 0 && renderToolCalls(message.toolCalls, message.id)}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="glass-panel border border-border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">Generating...</span>
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

