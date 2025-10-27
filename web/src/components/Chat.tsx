import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Textarea } from '@/theme/components/textarea'
import { Send, Loader2 } from 'lucide-react'
import logo from '../../assets/images/logo.svg'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'user',
          content: initialPrompt,
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'I\'m analyzing your request and generating the wireframe...',
          timestamp: new Date(),
        },
      ])
    }
  }, [initialPrompt, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    console.log('plannedMessage', plannedMessage)
    if (!plannedMessage?.content) return

    // Update or add the assistant message with the planned content
    setMessages((prevMessages) => {
      // Remove existing assistant message with id '2'
      const filteredMessages = prevMessages.filter((msg) => msg.id !== '2')
      
      // Add new assistant message
      return [...filteredMessages, {
        id: '2',
        role: 'assistant',
        content: plannedMessage.content,
        timestamp: new Date(),
      }]
    })
  }, [plannedMessage])

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
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
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

