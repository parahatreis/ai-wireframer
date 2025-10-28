export interface WireframeElement {
  type: string
  content?: {
    text?: string
    media?: {
      src?: string
      alt?: string
    }
  }
  props?: {
    variant?: string
    size?: string
    icon?: string
    align?: string
    state?: string
    asShadcn?: string
  }
  styles?: {
    padding?: string
    margin?: string
    gap?: string
    border?: string
    borderRadius?: string
    background?: string
    color?: string
    tw?: string
  }
  attributes?: {
    id?: string
    className?: string
    href?: string
    src?: string
    alt?: string
    type?: string
    placeholder?: string
    ariaLabel?: string
    dataTestId?: string
  }
  bindings?: {
    data?: string
    format?: string
    validation?: {
      required?: boolean
      pattern?: string
    }
  }
  interactions?: Array<{
    on: string
    do: string
  }>
  motion?: {
    transition?: string
    hover?: string
    press?: string
    reduceMotionSafe?: boolean
  }
  elements?: WireframeElement[]
}

export interface WireframeSection {
  id: string
  role: 'header' | 'hero' | 'content' | 'sidebar' | 'footer' | 'modal' | 'sheet'
  elements: WireframeElement[]
}

export interface WireframePage {
  name: string
  purpose?: string
  route?: string
  a11y?: {
    contrast?: string
    focusVisible?: boolean
    touchTargetMin?: number
  }
  layout?: {
    type?: string
    columns?: number
    gutter?: number
    maxWidth?: number
    stickyHeader?: boolean
    stickyFooter?: boolean
  }
  states?: string[]
  sections: WireframeSection[]
}

export interface WireframeMeta {
  title?: string
  description?: string
  platforms?: string[]
  platform?: string
  viewport?: string
  mood?: string
  primaryCta?: string
  brand?: {
    name?: string
    logoAlt?: string
  }
  rendererHints?: {
    framework?: string
    uiKit?: string
    classStrategy?: string
  }
  notes?: string
  planned?: string // Legacy field for backward compatibility
}

export interface WireframeGrid {
  breakpoints?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  columns?: {
    sm?: number
    md?: number
    lg?: number
  }
  gutter?: number
  maxWidth?: number
}

export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'tool' | 'system'
  content?: string
  tool_calls?: ToolCall[]
  tool_call_id?: string
  name?: string
}

export interface WireframeResponse {
  meta: WireframeMeta
  grid?: WireframeGrid
  library?: {
    components?: string[]
  }
  pages: WireframePage[]
  conversation?: ConversationMessage[]
}

