-- Add address-related fields to profiles table
-- This script ensures all address fields are properly added to the profiles table

-- Add address column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add individual address fields for better data structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'United States';

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.address IS 'Full address including street, city, state, and zip code';
COMMENT ON COLUMN public.profiles.street_address IS 'Street address line';
COMMENT ON COLUMN public.profiles.city IS 'City name';
COMMENT ON COLUMN public.profiles.state IS 'State or province code';
COMMENT ON COLUMN public.profiles.zip_code IS 'ZIP or postal code';
COMMENT ON COLUMN public.profiles.country IS 'Country name';

-- Update the profile creation trigger to handle all address fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    phone, 
    company,
    address,
    street_address,
    city,
    state,
    zip_code,
    country,
    role,
    is_admin
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'company', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'address', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'street_address', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'city', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'state', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'zip_code', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'country', 'United States'),
    'client',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    address = EXCLUDED.address,
    street_address = EXCLUDED.street_address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    zip_code = EXCLUDED.zip_code,
    country = EXCLUDED.country,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance on address fields
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_zip_code ON public.profiles(zip_code);

-- Add RLS policies for the new fields (if not already covered by existing policies)
-- The existing policies should cover these new fields automatically since they use auth.uid() = id
