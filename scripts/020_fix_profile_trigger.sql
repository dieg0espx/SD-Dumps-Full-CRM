-- Fix the profile creation trigger to match the actual database schema
-- Remove references to the non-existent 'address' column

-- Update the profile creation trigger to handle address fields correctly
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

-- Remove the address column if it exists (since it's not in the actual schema)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS address;
