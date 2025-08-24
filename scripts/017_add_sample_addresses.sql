-- Add sample address data to existing profiles for testing
-- This script updates existing profiles with sample address data

UPDATE public.profiles 
SET address = '123 Main Street, San Diego, CA 92101'
WHERE id = '11111111-1111-1111-1111-111111111111' 
AND (address IS NULL OR address = '');

UPDATE public.profiles 
SET address = '456 Oak Avenue, Los Angeles, CA 90210'
WHERE id = '22222222-2222-2222-2222-222222222222' 
AND (address IS NULL OR address = '');

UPDATE public.profiles 
SET address = '789 Pine Road, San Francisco, CA 94102'
WHERE id = '33333333-3333-3333-3333-333333333333' 
AND (address IS NULL OR address = '');

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.address IS 'Full address including street, city, state, and zip code';
