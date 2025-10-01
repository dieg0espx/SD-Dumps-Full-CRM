// Debug script to test signature column in Supabase
// Run this in your browser console on the booking page

async function debugSignatureColumn() {
  console.log('🧪 Starting signature column debug...');
  
  try {
    // Get the supabase client from the page
    const { createClient } = await import('/lib/supabase/client.ts');
    const supabase = createClient();
    
    // Test 1: Check if signature column exists
    console.log('🔍 Test 1: Checking if signature column exists...');
    const { data: selectData, error: selectError } = await supabase
      .from('bookings')
      .select('id, signature')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Select failed:', selectError);
      if (selectError.message && selectError.message.includes('column "signature" does not exist')) {
        console.error('🚨 SIGNATURE COLUMN DOES NOT EXIST!');
        console.log('📋 Please run this SQL in your Supabase SQL editor:');
        console.log(`
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS signature TEXT;

COMMENT ON COLUMN public.bookings.signature IS 'Base64 encoded signature image data';
        `);
        return;
      }
    } else {
      console.log('✅ Signature column exists!');
    }
    
    // Test 2: Try to update an existing record
    if (selectData && selectData.length > 0) {
      console.log('🔍 Test 2: Testing signature update...');
      const testSignature = 'test_signature_' + Date.now();
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ signature: testSignature })
        .eq('id', selectData[0].id);
      
      if (updateError) {
        console.error('❌ Update failed:', updateError);
      } else {
        console.log('✅ Update successful!');
        
        // Clean up
        await supabase
          .from('bookings')
          .update({ signature: null })
          .eq('id', selectData[0].id);
        console.log('🧹 Cleaned up test data');
      }
    }
    
    // Test 3: Show table structure
    console.log('🔍 Test 3: Checking table structure...');
    console.log('Current bookings table should have these columns:');
    console.log('- id, user_id, container_type_id, start_date, end_date');
    console.log('- service_type, total_amount, signature, status, payment_status');
    console.log('- created_at, updated_at');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

// Run the debug function
debugSignatureColumn();
