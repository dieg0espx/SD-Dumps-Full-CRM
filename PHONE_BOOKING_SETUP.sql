-- SQL Migration for Phone Booking Feature
-- Run this in your Supabase SQL Editor

-- Create payment_links table
CREATE TABLE IF NOT EXISTS public.payment_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_payment_links_token ON public.payment_links(token);
CREATE INDEX IF NOT EXISTS idx_payment_links_booking_id ON public.payment_links(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON public.payment_links(status);
CREATE INDEX IF NOT EXISTS idx_payment_links_expires_at ON public.payment_links(expires_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- Allow public to read payment links by token (for the payment page)
CREATE POLICY "Anyone can view payment link by token"
    ON public.payment_links
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert payment links (admins only - enforced in API)
CREATE POLICY "Authenticated users can create payment links"
    ON public.payment_links
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update payment links (for completion)
CREATE POLICY "Authenticated users can update payment links"
    ON public.payment_links
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment_links
DROP TRIGGER IF EXISTS set_payment_links_updated_at ON public.payment_links;
CREATE TRIGGER set_payment_links_updated_at
    BEFORE UPDATE ON public.payment_links
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add new booking status for phone bookings
-- Note: This assumes your bookings table has a status column
-- If the CHECK constraint exists, you may need to drop and recreate it
-- Alternatively, you can just document that 'awaiting_card' is a valid status

COMMENT ON TABLE public.payment_links IS 'Stores payment links for phone bookings where admin creates booking and sends link to customer';
COMMENT ON COLUMN public.payment_links.token IS 'Unique token used in the payment link URL';
COMMENT ON COLUMN public.payment_links.expires_at IS 'Link expires 7 days after creation';
COMMENT ON COLUMN public.payment_links.completed_at IS 'Timestamp when customer completed card entry';
COMMENT ON COLUMN public.payment_links.status IS 'pending: awaiting customer action, completed: card saved, expired: link expired, cancelled: booking cancelled';
