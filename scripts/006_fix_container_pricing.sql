-- Fix container types with correct SD Dumps pricing
-- Add is_hidden column first if it doesn't exist
ALTER TABLE public.container_types ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Clear existing container types
DELETE FROM public.container_types;

-- Insert correct container types with SD Dumps pricing
INSERT INTO public.container_types (name, size, description, price_per_day, available_quantity, is_hidden) VALUES
('17 Yard Dumpster', '17 Yard', 'Perfect for medium projects - includes 2 tons of debris', 595.00, 8, false),
('21 Yard Dumpster', '21 Yard', 'Ideal for larger projects - includes 2 tons of debris', 695.00, 6, false);

-- Insert hidden service categories for additional charges
INSERT INTO public.container_types (name, size, description, price_per_day, available_quantity, is_hidden) VALUES
('17 Yard Extra Tonnage', 'Per Ton', 'Additional tonnage beyond included 2 tons for 17 yard dumpster', 125.00, 999, true),
('21 Yard Extra Tonnage', 'Per Ton', 'Additional tonnage beyond included 2 tons for 21 yard dumpster', 125.00, 999, true),
('Appliance Disposal', 'Per Item', 'Additional charge for appliance disposal', 30.00, 999, true),
('Extra Day Rental', 'Per Day', 'Additional charge for extending rental period', 30.00, 999, true);
