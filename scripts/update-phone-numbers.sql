-- One-time migration to update profiles with phone numbers from payment_links
-- This fixes the issue where phone numbers were stored in payment_links but not in profiles

UPDATE profiles
SET phone = payment_links.customer_phone
FROM payment_links
WHERE profiles.email = payment_links.customer_email
  AND (profiles.phone IS NULL OR profiles.phone = '')
  AND payment_links.customer_phone IS NOT NULL
  AND payment_links.customer_phone != '';

-- Show affected rows
SELECT
  p.id,
  p.email,
  p.full_name,
  p.phone as updated_phone,
  pl.customer_phone as source_phone
FROM profiles p
INNER JOIN payment_links pl ON p.email = pl.customer_email
WHERE p.phone IS NOT NULL AND p.phone != '';
