import type { WireframeResponse } from '@/types/wireframe'

const AI_SERVICE_URL = 'http://localhost:5566'

export interface GenerateRequest {
  prompt: string
  platform?: string
  viewport_w?: number
  viewport_h?: number
}

const WEB_KEYWORDS = [/web/i, /desktop/i, /dashboard/i, /landing\s?page/i, /website/i]
const MOBILE_KEYWORDS = [/mobile/i, /app\b/i, /iphone/i, /android/i]

const WEB_VIEWPORT = { w: 1440, h: 1024 }
const MOBILE_VIEWPORT = { w: 390, h: 844 }

function inferPlatform(prompt: string, provided?: string): 'web' | 'mobile' {
  if (provided === 'web' || provided === 'mobile') return provided
  if (prompt) {
    const lower = prompt.toLowerCase()
    if (MOBILE_KEYWORDS.some((re) => re.test(lower))) return 'mobile'
    if (WEB_KEYWORDS.some((re) => re.test(lower))) return 'web'
  }
  return 'web'
}

function inferViewport(prompt: string, platform: 'web' | 'mobile', w?: number, h?: number): { w: number; h: number } {
  if (w && h) return { w, h }
  const re = /(\d{3,4})\s*[x×]\s*(\d{3,4})/i
  const match = prompt.match(re)
  if (match) {
    return { w: Number(match[1]), h: Number(match[2]) }
  }
  return platform === 'mobile' ? MOBILE_VIEWPORT : WEB_VIEWPORT
}

export async function generateWireframe(request: GenerateRequest): Promise<WireframeResponse> {
  try {
    const platform = inferPlatform(request.prompt, request.platform)
    const viewport = inferViewport(request.prompt, platform, request.viewport_w, request.viewport_h)

    const response = await fetch(`${AI_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        platform,
        viewport_w: viewport.w,
        viewport_h: viewport.h,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as WireframeResponse
  } catch (error) {
    console.error('Failed to generate wireframe:', error)
    throw error
  }
}

