/**
 * Utility functions for handling signature data conversion
 */

/**
 * Converts a base64 data URL to a plain base64 string
 * @param dataUrl - The base64 data URL (e.g., "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...")
 * @returns Base64 string without the data URL prefix
 */
export function extractBase64FromDataUrl(dataUrl: string): string {
  try {
    if (!dataUrl || !dataUrl.includes(',')) {
      throw new Error('Invalid data URL format')
    }
    
    // Validate PNG format
    if (!dataUrl.startsWith('data:image/png;base64,')) {
      throw new Error('Signature must be in PNG format')
    }
    
    // Extract the base64 part from the data URL
    const base64Data = dataUrl.split(',')[1]
    
    if (!base64Data) {
      throw new Error('No base64 data found in URL')
    }
    
    // Validate base64 data size (PNG signatures should be at least 100 characters)
    if (base64Data.length < 100) {
      throw new Error('Signature data too small - please draw a proper signature')
    }
    
    return base64Data
  } catch (error) {
    console.error('Error extracting base64 from data URL:', error)
    throw new Error('Failed to extract base64 data from signature')
  }
}

/**
 * Converts a base64 string back to a data URL
 * @param base64Data - The base64 string
 * @param mimeType - The MIME type (default: 'image/png')
 * @returns Base64 data URL
 */
export function createDataUrlFromBase64(base64Data: string, mimeType: string = 'image/png'): string {
  try {
    if (!base64Data) {
      throw new Error('No base64 data provided')
    }
    
    return `data:${mimeType};base64,${base64Data}`
  } catch (error) {
    console.error('Error creating data URL from base64:', error)
    throw new Error('Failed to create data URL from base64')
  }
}

/**
 * Validates if a string is a valid base64 data URL
 * @param dataUrl - The string to validate
 * @returns boolean indicating if it's a valid data URL
 */
export function isValidDataUrl(dataUrl: string): boolean {
  try {
    return dataUrl.startsWith('data:') && dataUrl.includes('base64,')
  } catch {
    return false
  }
}

/**
 * Validates if a string is valid base64 data
 * @param base64Data - The string to validate
 * @returns boolean indicating if it's valid base64
 */
export function isValidBase64(base64Data: string): boolean {
  try {
    if (!base64Data) return false
    
    // Check if it's valid base64 by trying to decode it
    const decoded = atob(base64Data)
    return decoded.length > 0
  } catch {
    return false
  }
}

/**
 * Gets the size of base64 data in bytes
 * @param base64Data - The base64 string
 * @returns Size in bytes
 */
export function getBase64Size(base64Data: string): number {
  try {
    if (!base64Data) return 0
    
    // Base64 encoding increases size by ~33%
    // So to get original size: (base64Length * 3) / 4
    return Math.floor((base64Data.length * 3) / 4)
  } catch {
    return 0
  }
}

/**
 * Creates a preview of the signature data for debugging
 * @param dataUrl - The signature data URL
 * @returns Object with signature information
 */
export function getSignatureInfo(dataUrl: string) {
  try {
    const base64Data = extractBase64FromDataUrl(dataUrl)
    const size = getBase64Size(base64Data)
    
    return {
      isValid: isValidDataUrl(dataUrl),
      base64Length: base64Data.length,
      estimatedSizeBytes: size,
      preview: base64Data.substring(0, 50) + '...',
      mimeType: dataUrl.split(';')[0].replace('data:', '')
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}