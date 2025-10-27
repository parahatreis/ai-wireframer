export interface WireframeElement {
  type: 'header' | 'text' | 'form' | 'button' | 'link' | 'image' | 'container' | 'section' | 'nav' | 'footer' | 'input'
  content?: string
  styles?: Record<string, string>
  attributes?: {
    id?: string
    class?: string
    href?: string
    src?: string
    alt?: string
    type?: string
    placeholder?: string
  }
  elements?: WireframeElement[]
}

export interface WireframePage {
  name: string
  description?: string
  elements: WireframeElement[]
}

export interface WireframeMeta {
  title?: string
  description?: string
  platform?: string
  viewport?: string
}

export interface WireframeResponse {
  meta: WireframeMeta
  pages: WireframePage[]
}

