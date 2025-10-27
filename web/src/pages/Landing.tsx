import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/theme/components/button'
import { Input } from '@/theme/components/input'
import { Badge } from '@/theme/components/badge'
import bgImage from '../../assets/images/bg3.png'
import logo from '../../assets/images/logo.svg'
import { Clover } from 'lucide-react'
import FeaturesSection from '@/components/FeaturesSection'
import GetStartedSection from '@/components/GetStartedSection'
import Footer from '@/components/Footer'

const examplePrompts = [
  // Mobile
  "Mobile banking app home screen",
  "Mobile chat app interface",
  "Mobile e-commerce product page",

  // Web
  "Web dashboard with charts and sidebar",
  "Web project management board",
  "Web analytics dashboard for marketing",
];

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
      <motion.header 
        className="opacity-100 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-white h-[50px] pt-3">
            <img src={logo} alt="Logo" className="h-full" />
          </Link>
          <Link to="/login">
            <Button variant="outline" size="default">Sign In</Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex flex-col items-center text-center min-h-screen">
          <motion.h1 
            className="text-7xl font-semibold tracking-tight leading-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Turn your ideas into <br />
            <span className="text-primary-light">wireframes instantly.</span>
          </motion.h1>
          <motion.p 
            className="mt-6 text-xl text-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Describe your app and let AI sketch it for you.
          </motion.p>

          {/* Prompt Input */}
          <motion.div 
            className="mt-16 flex w-full max-w-3xl gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
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
              className="h-14"
            >
              <Clover size={22} />
              Generate
            </Button>
          </motion.div>

          {/* Example Prompts */}
          <motion.div 
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-sm font-medium text-white">Try:</span>
            {examplePrompts.map((example, index) => (
              <motion.div
                key={example}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer text-sm"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <FeaturesSection />
        <GetStartedSection />
      </main>
      <Footer />
    </div>
  )
}

