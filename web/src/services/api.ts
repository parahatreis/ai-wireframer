import type { GenerateResponse } from '@/types/wireframe'

const AI_SERVICE_URL = 'http://localhost:5566'

export interface GenerateRequest {
  prompt: string
  options?: {
    n_candidates?: number
  }
}

/**
 * Generate UI Spec using NEW_FLOW AI service
 * @param request - { prompt, options }
 * @returns GenerateResponse with { spec, meta }
 */
export async function generateUISpec(request: GenerateRequest): Promise<GenerateResponse> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as GenerateResponse
  } catch (error) {
    console.error('Failed to generate UI spec:', error)
    throw error
  }
}

// Legacy function for backward compatibility (deprecated)
export async function generateWireframe(request: { prompt: string }): Promise<GenerateResponse> {
  console.warn('generateWireframe is deprecated, use generateUISpec instead')
  return generateUISpec(request)
}
