const AI_SERVICE_URL = 'http://localhost:5566'

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface HtmlDesignRequest {
  prompt: string
  num_variations?: number
  platform?: 'mobile' | 'web'
  conversation_history?: ConversationMessage[]
}

export interface HtmlDesignResponse {
  designs: string[]
  count: number
  platform: 'mobile' | 'web'
  conversation: ConversationMessage[]
}

export async function generateHtmlDesigns(request: HtmlDesignRequest): Promise<HtmlDesignResponse> {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/generate-html-design`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        num_variations: request.num_variations || 3,
        platform: request.platform,
        conversation_history: request.conversation_history,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data as HtmlDesignResponse
  } catch (error) {
    console.error('Failed to generate HTML designs:', error)
    throw error
  }
}

