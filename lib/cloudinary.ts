/**
 * Upload a PNG signature to Cloudinary via API route
 * @param base64Data - The base64 encoded PNG signature data
 * @param bookingId - The booking ID for organization
 * @returns Promise with the uploaded image URL
 */
export async function uploadSignatureToCloudinary(
  base64Data: string,
  bookingId: string
): Promise<string> {
  try {
    console.log('☁️ Uploading signature to Cloudinary via API:', {
      base64Length: base64Data.length,
      bookingId,
      estimatedSizeKB: Math.round((base64Data.length * 3) / 4 / 1024)
    })

    // Call the server-side API route
    const response = await fetch('/api/upload-signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Data,
        bookingId
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload signature')
    }

    const result = await response.json()

    console.log('✅ Signature uploaded to Cloudinary:', {
      cloudinaryUrl: result.cloudinaryUrl,
      publicId: result.publicId,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    })

    return result.cloudinaryUrl
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error)
    throw new Error(`Failed to upload signature to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Delete a signature from Cloudinary via API route
 * @param publicId - The Cloudinary public ID
 * @returns Promise with deletion result
 */
export async function deleteSignatureFromCloudinary(publicId: string): Promise<void> {
  try {
    console.log('🗑️ Deleting signature from Cloudinary via API:', { publicId })
    
    // Call the server-side API route for deletion
    const response = await fetch('/api/delete-signature', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete signature')
    }

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Signature deleted from Cloudinary:', { publicId })
    } else {
      console.warn('⚠️ Signature deletion result:', result)
    }
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error)
    throw new Error(`Failed to delete signature from Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public ID
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const match = url.match(/\/upload\/v\d+\/(.+)\.png$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/**
 * Get Cloudinary configuration status (client-side)
 * @returns Object with configuration status
 */
export function getCloudinaryConfig() {
  // On client-side, we can only check the public cloud name
  // The API key and secret are server-side only
  return {
    cloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: false, // Not accessible on client-side
    apiSecret: false, // Not accessible on client-side
    isConfigured: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
}
