import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/ui/components/button'
import { Input } from '@/ui/components/input'
import { Badge } from '@/ui/components/badge'
import bgImage from '../../assets/images/bg2.png'
import logo from '../../assets/images/logo.svg'

const examplePrompts = [
  'Dashboard for teachers',
  'E-commerce product page',
  'Social media feed',
  'Project management board',
]

export default function Landing() {
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()

  const handleGenerate = () => {
    if (!prompt.trim()) return

    // Mock file creation with random UUID
    const id = crypto.randomUUID()
    navigate(`/file/${id}?prompt=${encodeURIComponent(prompt)}`)
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGenerate()
    }
  }

  return (
    <div 
      className="min-h-screen text-foreground vignette"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header */}
      <header>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-white">
            <img src={logo} alt="Logo" className="w-auto h-[60px]" />
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-7xl font-semibold tracking-tight leading-tight text-white">
            Turn your ideas into <br />
            <span className="text-primary-light">wireframes instantly.</span>
          </h1>
          <p className="mt-6 text-xl text-foreground max-w-2xl">
            Describe your app and let AI sketch it for you.
          </p>

          {/* Prompt Input */}
          <div className="mt-16 flex w-full max-w-3xl gap-3">
            <Input
              type="text"
              placeholder="Describe your idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-14 text-lg text-white bg-white"
            />
            <Button 
              onClick={handleGenerate} 
              // disabled={!prompt.trim()} 
              size="lg"
              className="h-14 px-10 font-semibold"
            >
              Generate
            </Button>
          </div>

          {/* Example Prompts */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-white">Try:</span>
            {examplePrompts.map((example) => (
              <Badge
                key={example}
                variant="secondary"
                className="cursor-pointer text-sm"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

