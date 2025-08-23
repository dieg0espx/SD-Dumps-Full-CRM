-- Fix database relationships and add missing foreign key constraints
-- This script adds proper relationships between bookings and profiles tables

-- First, let's add the missing columns to profiles table that were referenced in other scripts
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add customer_address column to bookings table if it doesn't exist
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_address TEXT;

-- Create indexes for better performance on joins
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);

-- Add admin policies for all tables so admins can manage everything
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

CREATE POLICY "Admins can manage container types" ON public.container_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );
