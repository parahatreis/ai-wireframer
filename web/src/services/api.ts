import type { WireframeResponse } from '@/types/wireframe'

const AI_SERVICE_URL = 'http://localhost:5566'

export interface GenerateRequest {
  prompt: string
  platform?: string
  viewport_w?: number
  viewport_h?: number
}

export async function generateWireframe(request: GenerateRequest): Promise<WireframeResponse> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        platform: request.platform || 'web',
        viewport_w: request.viewport_w || 1440,
        viewport_h: request.viewport_h || 1024,
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

