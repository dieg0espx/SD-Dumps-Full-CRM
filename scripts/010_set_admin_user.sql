-- Set a user as admin by email
-- Replace 'your-email@example.com' with the actual email address of the user you want to make admin

UPDATE profiles 
SET 
  is_admin = true,
  role = 'admin',
  updated_at = now()
WHERE email = 'your-email@example.com';

-- If no rows were updated, it means the profile doesn't exist yet
-- You can check existing profiles with:
-- SELECT id, email, full_name, is_admin, role FROM profiles;

-- To see all users and their admin status:
SELECT 
  id,
  email, 
  full_name, 
  company,
  is_admin, 
  role,
  created_at
FROM profiles 
ORDER BY created_at DESC;
