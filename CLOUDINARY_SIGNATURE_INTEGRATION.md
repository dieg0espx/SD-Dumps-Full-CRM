# Cloudinary Signature Integration Documentation

## Overview

This document describes the Cloudinary integration for storing digital signatures. The system uploads PNG signatures to Cloudinary and stores the URL in the database for efficient storage and retrieval.

## System Architecture

### Components

1. **Cloudinary Utility** (`lib/cloudinary.ts`)
   - PNG signature upload to Cloudinary
   - Folder organization: `SD-Dumps/signatures/`
   - Image optimization and transformation
   - Error handling and fallback

2. **Database Schema** (`scripts/034_add_signature_img_url.sql`)
   - Added `signature_img_url` column to signatures table
   - Stores Cloudinary URLs for signature images
   - Maintains base64 data as backup

3. **Booking Form Integration** (`components/booking-form.tsx`)
   - Cloudinary upload during signature capture
   - Database storage with both base64 and URL
   - Fallback to base64-only storage if Cloudinary fails

## Cloudinary Configuration

### Environment Variables

Set up the following environment variables:

```bash
# Public Cloudinary configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Server-side Cloudinary configuration
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Folder Structure

Signatures are organized in Cloudinary as:
```
SD-Dumps/
└── signatures/
    ├── signature_booking-id-1_timestamp.png
    ├── signature_booking-id-2_timestamp.png
    └── ...
```

## Database Schema

### Updated Signatures Table

```sql
CREATE TABLE public.signatures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  signature_data TEXT NOT NULL, -- Base64 encoded signature (backup)
  signature_img_url TEXT, -- Cloudinary URL for signature image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Migration Script

Run the migration to add the new column:

```sql
-- File: scripts/034_add_signature_img_url.sql
ALTER TABLE public.signatures 
ADD COLUMN IF NOT EXISTS signature_img_url TEXT;

CREATE INDEX IF NOT EXISTS idx_signatures_img_url ON public.signatures(signature_img_url);
```

## API Reference

### Cloudinary Utility Functions

```typescript
// Upload signature to Cloudinary
uploadSignatureToCloudinary(base64Data: string, bookingId: string): Promise<string>

// Delete signature from Cloudinary
deleteSignatureFromCloudinary(publicId: string): Promise<void>

// Extract public ID from Cloudinary URL
extractPublicIdFromUrl(url: string): string | null

// Get Cloudinary configuration status
getCloudinaryConfig(): CloudinaryConfig
```

### Upload Parameters

```typescript
const uploadParams = {
  folder: 'SD-Dumps/signatures',
  public_id: `signature_${bookingId}_${timestamp}`,
  resource_type: 'image',
  format: 'png',
  quality: 'auto',
  fetch_format: 'auto',
  transformation: [
    { width: 800, height: 400, crop: 'limit' },
    { quality: 'auto' }
  ]
}
```

## Signature Storage Flow

### 1. Signature Capture
- User draws signature on canvas
- Canvas converted to PNG format with high quality
- Base64 data extracted and validated

### 2. Cloudinary Upload
- PNG data uploaded to `SD-Dumps/signatures/` folder
- Image optimized and transformed
- Secure URL generated

### 3. Database Storage
- Both base64 data and Cloudinary URL stored
- Base64 serves as backup if Cloudinary fails
- URL provides efficient access to signature

### 4. Error Handling
- If Cloudinary upload fails, fallback to base64-only storage
- Comprehensive error logging
- Graceful degradation

## Usage Examples

### Basic Signature Upload

```typescript
import { uploadSignatureToCloudinary } from '@/lib/cloudinary'

// Upload signature to Cloudinary
const cloudinaryUrl = await uploadSignatureToCloudinary(base64Data, bookingId)

// Store in database
const { data: signatureData } = await supabase
  .from('signatures')
  .insert({
    booking_id: bookingId,
    signature_data: base64Data,
    signature_img_url: cloudinaryUrl
  })
  .select()
  .single()
```

### Retrieve Signature

```typescript
// Get signature with Cloudinary URL
const { data: signature } = await supabase
  .from('signatures')
  .select('signature_img_url, signature_data')
  .eq('booking_id', bookingId)
  .single()

// Use Cloudinary URL if available, fallback to base64
const signatureUrl = signature.signature_img_url || 
  `data:image/png;base64,${signature.signature_data}`
```

### Delete Signature

```typescript
import { deleteSignatureFromCloudinary, extractPublicIdFromUrl } from '@/lib/cloudinary'

// Delete from Cloudinary
if (signature.signature_img_url) {
  const publicId = extractPublicIdFromUrl(signature.signature_img_url)
  if (publicId) {
    await deleteSignatureFromCloudinary(publicId)
  }
}

// Delete from database
await supabase
  .from('signatures')
  .delete()
  .eq('id', signatureId)
```

## Setup Instructions

### 1. Environment Configuration

Add to your `.env.local` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Database Migration

Run the database migration:

```sql
-- Execute in Supabase SQL editor
-- File: scripts/034_add_signature_img_url.sql
```

### 3. Install Dependencies

```bash
npm install cloudinary --legacy-peer-deps
```

### 4. Test Integration

1. Navigate to booking form
2. Complete signature step
3. Check browser console for Cloudinary upload logs
4. Verify signature stored in `SD-Dumps/signatures/` folder
5. Check database for `signature_img_url` column

## Error Handling

### Common Issues

1. **Cloudinary Not Configured**
   - Check environment variables
   - Verify Cloudinary account setup
   - Test configuration with `getCloudinaryConfig()`

2. **Upload Failures**
   - Check network connectivity
   - Verify API credentials
   - Review Cloudinary account limits

3. **Database Storage Issues**
   - Ensure migration script executed
   - Check RLS policies
   - Verify table permissions

### Debug Information

The system provides comprehensive logging:

```typescript
console.log('☁️ Uploading signature to Cloudinary:', {
  base64Length: base64Data.length,
  bookingId,
  estimatedSizeKB: Math.round((base64Data.length * 3) / 4 / 1024)
})

console.log('✅ Signature uploaded to Cloudinary:', {
  publicId: result.public_id,
  secureUrl: result.secure_url,
  format: result.format,
  width: result.width,
  height: result.height,
  bytes: result.bytes
})
```

## Performance Considerations

### Image Optimization
- Automatic quality optimization
- Size limits (800x400 max)
- PNG format for signatures
- Efficient transformation pipeline

### Storage Strategy
- Cloudinary for primary storage
- Base64 as backup
- Automatic cleanup on booking deletion
- Efficient URL-based access

### Cost Optimization
- Image compression and optimization
- Folder organization for easy management
- Automatic format conversion
- Size limits to control storage costs

## Security Features

### Data Protection
- Secure HTTPS URLs
- RLS policies for database access
- API key protection
- User-specific signature access

### Privacy
- Signatures stored in organized folders
- Automatic cleanup capabilities
- Secure URL generation
- Access control through RLS

## Monitoring and Maintenance

### Health Checks
- Cloudinary configuration validation
- Upload success monitoring
- Database integrity checks
- Error rate tracking

### Maintenance Tasks
- Regular cleanup of orphaned signatures
- Monitor Cloudinary storage usage
- Review and optimize image transformations
- Update security policies as needed

## Troubleshooting

### Debug Steps

1. **Check Configuration**
   ```typescript
   const config = getCloudinaryConfig()
   console.log('Cloudinary config:', config)
   ```

2. **Test Upload**
   ```typescript
   try {
     const url = await uploadSignatureToCloudinary(testData, 'test-booking')
     console.log('Upload successful:', url)
   } catch (error) {
     console.error('Upload failed:', error)
   }
   ```

3. **Verify Database**
   ```sql
   SELECT signature_img_url, created_at 
   FROM signatures 
   WHERE signature_img_url IS NOT NULL 
   ORDER BY created_at DESC 
   LIMIT 5;
   ```

### Support

For issues with Cloudinary integration:

1. Check environment variables
2. Verify Cloudinary account status
3. Review browser console logs
4. Test with sample data
5. Check database migration status

## Future Enhancements

### Potential Improvements
1. **Batch Upload** for multiple signatures
2. **Image Analytics** for usage tracking
3. **Advanced Transformations** for different use cases
4. **CDN Integration** for global delivery
5. **Automated Cleanup** for old signatures

### API Extensions
1. **Signature Validation** endpoints
2. **Bulk Operations** for signature management
3. **Analytics Dashboard** for storage usage
4. **Integration Testing** tools
5. **Performance Monitoring** metrics

## Changelog

### Version 1.0.0
- Initial Cloudinary integration
- PNG signature upload to `SD-Dumps/signatures/` folder
- Database schema with `signature_img_url` column
- Fallback to base64 storage
- Comprehensive error handling
- Complete test suite
