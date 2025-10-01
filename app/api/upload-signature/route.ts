import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const { base64Data, bookingId } = await request.json()

    // Validate input
    if (!base64Data || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields: base64Data and bookingId' },
        { status: 400 }
      )
    }

    // Validate base64 data
    if (base64Data.length < 100) {
      return NextResponse.json(
        { error: 'Signature data too small' },
        { status: 400 }
      )
    }

    console.log('☁️ Server-side Cloudinary upload:', {
      base64Length: base64Data.length,
      bookingId,
      estimatedSizeKB: Math.round((base64Data.length * 3) / 4 / 1024)
    })

    // Create the data URL for upload
    const dataUrl = `data:image/png;base64,${base64Data}`
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: 'SD-Dumps/signatures',
      public_id: `signature_${bookingId}_${Date.now()}`,
      resource_type: 'image',
      format: 'png',
      quality: 'auto',
      fetch_format: 'auto',
      transformation: [
        { width: 800, height: 400, crop: 'limit' }, // Limit size for signatures
        { quality: 'auto' }
      ]
    })

    console.log('✅ Signature uploaded to Cloudinary:', {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    })

    return NextResponse.json({
      success: true,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    })

  } catch (error) {
    console.error('❌ Cloudinary upload error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to upload signature to Cloudinary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
