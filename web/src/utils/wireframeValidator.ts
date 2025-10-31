import type { GenerateResponse } from '@/types/wireframe'

/**
 * Validates UI Spec format from NEW_FLOW AI service
 */
export function isValidUISpec(data: any): boolean {
  return !!(
    data &&
    data.spec &&
    data.spec.version &&
    data.spec.theme &&
    data.spec.pages &&
    Array.isArray(data.spec.pages)
  )
}

/**
 * Validates and normalizes GenerateResponse
 * Ensures all required fields are present
 */
export function validateGenerateResponse(data: any): GenerateResponse {
  if (!isValidUISpec(data)) {
    throw new Error('Invalid UI Spec format: missing required fields')
  }

  const response = data as GenerateResponse

  // Validate theme structure
  if (!response.spec.theme.colors || !response.spec.theme.typography) {
    throw new Error('Invalid theme structure: missing colors or typography')
  }

  // Validate pages
  if (response.spec.pages.length === 0) {
    throw new Error('Invalid spec: no pages defined')
  }

  // Validate each page has required fields
  response.spec.pages.forEach((page, idx) => {
    if (!page.route || !page.meta || !page.sections) {
      throw new Error(`Invalid page ${idx}: missing route, meta, or sections`)
    }
  })

  return response
}

/**
 * Validates wireframe data (legacy format support)
 * @deprecated Use validateGenerateResponse instead
 */
export function validateWireframe(data: any): any {
  if (!data) {
    throw new Error('No wireframe data provided')
  }

  // Try new format first
  if (isValidUISpec(data)) {
    return validateGenerateResponse(data)
  }

  // Legacy format validation (if needed)
  if (data.pages && Array.isArray(data.pages)) {
    return data
  }

  throw new Error('Invalid wireframe format')
}
