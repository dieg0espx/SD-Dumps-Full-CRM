# Debug Signature Storage Issue

## Step 1: Run Database Migration

**CRITICAL**: First, you must run the database migration to create the signatures table.

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/032_create_signatures_table.sql`
4. Execute the SQL

## Step 2: Test the Signature Flow

1. Go to the booking page
2. Navigate through steps 1-5 to reach Step 6 (Digital Signature)
3. Sign on the signature pad
4. Click "Save Signature"
5. Check browser console (F12) for logs

## Expected Console Logs

You should see these logs in order:

```javascript
// When you click "Save Signature":
💾 Saving signature: { dataUrlLength: 12345, ... }
✅ Signature saved successfully

// When signature is processed:
📝 Signature captured: { dataUrlLength: 12345, ... }
✅ Signature converted to blob and stored in state: { blobSize: 8765, ... }
📝 Original signature data URL info: { fullDataUrlLength: 12345, ... }
🔍 Testing signatures table existence...

// If signatures table exists:
✅ Signatures table exists and is accessible
🚀 Advancing to payment step (step 7)

// When booking is created and signature is stored:
💾 Storing signature in signatures table...
✅ Signature stored successfully: { signatureId: "abc123", ... }
```

## Common Issues and Solutions

### Issue 1: "SIGNATURES TABLE DOES NOT EXIST!"
**Solution**: Run the database migration script `scripts/032_create_signatures_table.sql`

### Issue 2: No signature logs appear
**Solution**: Check if you're actually signing and clicking "Save Signature"

### Issue 3: Signature captured but not stored
**Solution**: Check for database connection issues or RLS policy problems

### Issue 4: Empty signature data
**Solution**: Check if the signature pad is working correctly

## Manual Test Button

Use the yellow "Test Signatures Table" button on Step 6 to verify:
- Signatures table exists
- You can insert test data
- Database connection is working

## Database Verification

After running the migration, verify the table was created:

```sql
-- Run this in Supabase SQL editor to check:
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'signatures' 
ORDER BY ordinal_position;
```

You should see:
- id (uuid)
- booking_id (uuid)
- signature_data (text)
- created_at (timestamp with time zone)
- updated_at (timestamp with time zone)
