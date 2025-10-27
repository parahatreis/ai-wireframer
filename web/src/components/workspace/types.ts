import type { WireframeElement, WireframeSection } from '@/types/wireframe'

export interface WorkspacePage {
  id: string
  name: string
  x: number
  y: number
  w: number
  h: number
  description?: string
  platform?: 'mobile' | 'web'
  sections?: WireframeSection[]
  elements?: WireframeElement[]
}

export interface WorkspaceTransform {
  x: number
  y: number
  scale: number
}

