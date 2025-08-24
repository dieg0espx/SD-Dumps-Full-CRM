-- Check profiles table schema and sample data
-- This script helps debug the address field issue

-- Check if address column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check sample profile data
SELECT id, email, full_name, phone, company, address, created_at, updated_at
FROM public.profiles 
LIMIT 5;

-- Check if any profiles have address data
SELECT COUNT(*) as total_profiles,
       COUNT(address) as profiles_with_address,
       COUNT(*) - COUNT(address) as profiles_without_address
FROM public.profiles;
