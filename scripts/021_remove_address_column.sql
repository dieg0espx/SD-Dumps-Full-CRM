-- Remove the address column from profiles table
-- This column is not needed since we have individual address fields

-- Drop the address column if it exists
ALTER TABLE public.profiles DROP COLUMN IF EXISTS address;

-- Verify the column was removed
-- The profiles table should now only have: street_address, city, state, zip_code, country
