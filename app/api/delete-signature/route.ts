import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(request: NextRequest) {
  try {
    const { publicId } = await request.json()

    // Validate input
    if (!publicId) {
      return NextResponse.json(
        { error: 'Missing required field: publicId' },
        { status: 400 }
      )
    }

    console.log('🗑️ Server-side Cloudinary deletion:', { publicId })
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)
    
    console.log('✅ Signature deleted from Cloudinary:', {
      publicId,
      result: result.result
    })

    return NextResponse.json({
      success: result.result === 'ok',
      result: result.result,
      publicId
    })

  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to delete signature from Cloudinary',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
