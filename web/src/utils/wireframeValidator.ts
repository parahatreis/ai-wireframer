import type { WireframeResponse, WireframeElement } from '@/types/wireframe'

/**
 * Validates and normalizes wireframe data to ensure stable rendering
 */
export function validateWireframe(data: WireframeResponse): WireframeResponse {
  // Ensure meta exists
  if (!data.meta) {
    data.meta = {
      title: 'Untitled',
      platform: 'web',
    }
  }

  // Ensure pages exist
  if (!data.pages || data.pages.length === 0) {
    console.warn('No pages found in wireframe data')
    return data
  }

  // Validate each page
  data.pages = data.pages.map((page) => {
    // Ensure sections exist
    if (!page.sections || page.sections.length === 0) {
      console.warn(`Page "${page.name}" has no sections`)
      page.sections = []
    }

    // Validate each section
    page.sections = page.sections.map((section) => {
      // Ensure elements array exists
      if (!section.elements) {
        section.elements = []
      }

      // Normalize elements
      section.elements = section.elements.map(normalizeElement)

      return section
    })

    return page
  })

  return data
}

/**
 * Normalizes a single element to ensure all required fields exist
 */
function normalizeElement(element: WireframeElement): WireframeElement {
  // Ensure basic fields exist
  if (!element.type) {
    console.warn('Element missing type, defaulting to "container"')
    element.type = 'container'
  }

  // Normalize content
  if (!element.content) {
    element.content = {}
  }

  // If content is a string (old format), convert to new format
  if (typeof element.content === 'string') {
    element.content = { text: element.content }
  }

  // Ensure props exists
  if (!element.props) {
    element.props = {}
  }

  // Ensure styles exists
  if (!element.styles) {
    element.styles = {}
  }

  // Ensure attributes exists
  if (!element.attributes) {
    element.attributes = {}
  }

  // Ensure bindings exists
  if (!element.bindings) {
    element.bindings = {}
  }

  // Ensure interactions exists
  if (!element.interactions) {
    element.interactions = []
  }

  // Ensure motion exists
  if (!element.motion) {
    element.motion = {}
  }

  // Ensure elements array exists
  if (!element.elements) {
    element.elements = []
  }

  // Recursively normalize child elements
  if (element.elements && element.elements.length > 0) {
    element.elements = element.elements.map(normalizeElement)
  }

  return element
}

/**
 * Checks if wireframe data is valid
 */
export function isValidWireframe(data: unknown): data is WireframeResponse {
  if (!data || typeof data !== 'object') {
    return false
  }

  const wireframe = data as WireframeResponse

  // Check for required fields
  if (!wireframe.meta || !wireframe.pages) {
    return false
  }

  // Check if pages is an array
  if (!Array.isArray(wireframe.pages)) {
    return false
  }

  return true
}

/**
 * Logs validation warnings for debugging
 */
export function logValidationIssues(data: WireframeResponse): void {
  if (!data.pages || data.pages.length === 0) {
    console.warn('⚠️ No pages in wireframe')
    return
  }

  data.pages.forEach((page, pageIdx) => {
    if (!page.sections || page.sections.length === 0) {
      console.warn(`⚠️ Page ${pageIdx} "${page.name}" has no sections`)
      return
    }

    page.sections.forEach((section, sectionIdx) => {
      if (!section.elements || section.elements.length === 0) {
        console.warn(`⚠️ Page ${pageIdx} section ${sectionIdx} has no elements`)
      }

      section.elements?.forEach((element, elementIdx) => {
        if (!element.type) {
          console.warn(`⚠️ Page ${pageIdx} section ${sectionIdx} element ${elementIdx} has no type`)
        }
      })
    })
  })
}

