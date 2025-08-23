-- Add customer_address column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN customer_address text NOT NULL DEFAULT '';

-- Update the column to remove the default after adding it
ALTER TABLE public.bookings 
ALTER COLUMN customer_address DROP DEFAULT;

-- Add comment to document the column
COMMENT ON COLUMN public.bookings.customer_address IS 'Customer billing/contact address for the booking';
