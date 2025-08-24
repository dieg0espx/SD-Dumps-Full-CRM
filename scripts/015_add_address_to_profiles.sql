-- Add address column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS address TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.address IS 'Full address including street, city, state, and zip code';
