-- Add sample data for testing the admin dashboard
-- This script creates sample users, bookings, and payments

-- Insert sample users (these will create profiles via trigger)
-- Note: In a real scenario, users would sign up through the app
-- For testing, we'll create some sample profiles directly

-- Sample client profiles
INSERT INTO public.profiles (id, email, full_name, phone, company, role, is_admin) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John Doe', '555-0101', 'ABC Construction', 'client', false),
  ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane Smith', '555-0102', 'XYZ Renovations', 'client', false),
  ('33333333-3333-3333-3333-333333333333', 'mike.wilson@example.com', 'Mike Wilson', '555-0103', 'Wilson Contractors', 'client', false)
ON CONFLICT (id) DO NOTHING;

-- Sample bookings with different statuses
INSERT INTO public.bookings (id, user_id, container_type_id, start_date, end_date, pickup_time, delivery_address, customer_address, service_type, total_amount, status, payment_status, notes) VALUES
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM public.container_types WHERE name = '17 Yard Dumpster' LIMIT 1),
    CURRENT_DATE - INTERVAL '5 days',
    CURRENT_DATE + INTERVAL '2 days',
    '09:00:00',
    '123 Main St, Anytown, ST 12345',
    '123 Main St, Anytown, ST 12345',
    'delivery',
    595.00,
    'confirmed',
    'paid',
    'Construction debris removal'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    (SELECT id FROM public.container_types WHERE name = '21 Yard Dumpster' LIMIT 1),
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days',
    '10:30:00',
    '456 Oak Ave, Somewhere, ST 67890',
    '456 Oak Ave, Somewhere, ST 67890',
    'delivery',
    695.00,
    'pending',
    'pending',
    'Home renovation project'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '33333333-3333-3333-3333-333333333333',
    (SELECT id FROM public.container_types WHERE name = '17 Yard Dumpster' LIMIT 1),
    CURRENT_DATE - INTERVAL '10 days',
    CURRENT_DATE - INTERVAL '3 days',
    '08:00:00',
    '789 Pine Rd, Elsewhere, ST 11111',
    '789 Pine Rd, Elsewhere, ST 11111',
    'pickup',
    595.00,
    'completed',
    'paid',
    'Yard cleanup'
  )
ON CONFLICT (id) DO NOTHING;

-- Sample payments
INSERT INTO public.payments (id, booking_id, amount, payment_method, transaction_id, status) VALUES
  (
    '77777777-7777-7777-7777-777777777777',
    '44444444-4444-4444-4444-444444444444',
    595.00,
    'Credit Card',
    'txn_1234567890',
    'completed'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    '66666666-6666-6666-6666-666666666666',
    595.00,
    'Credit Card',
    'txn_0987654321',
    'completed'
  )
ON CONFLICT (id) DO NOTHING;
