-- Setup first admin user
-- Replace 'your-email@example.com' with the email address of the user you want to make admin

-- First, make sure the admin policies are applied
DO $$
BEGIN
    -- Add admin column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Set a specific user as admin (replace with your email)
-- You need to sign up first, then run this script with your email
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Verify the admin user was set
SELECT id, email, full_name, is_admin 
FROM public.profiles 
WHERE is_admin = true;
