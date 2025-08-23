-- Updated container types to match SD Dumps pricing and specifications
-- Clear existing data and insert correct container types
DELETE FROM public.container_types;

-- Insert SD Dumps container types with flat pricing (not per day)
INSERT INTO public.container_types (name, size, description, price_per_day, available_quantity, is_hidden) VALUES
('17 Yard Dumpster', '17 Yard', 'Perfect for medium projects, home cleanouts (includes 2 tons of debris)', 595.00, 5, false),
('21 Yard Dumpster', '21 Yard', 'Ideal for larger renovations, construction debris (includes 2 tons of debris)', 695.00, 3, false),
('Extra Tonnage', 'Per Ton', 'Additional tonnage beyond included 2 tons', 125.00, 999, true),
('Appliance Disposal', 'Per Item', 'Disposal of appliances (refrigerators, washers, etc.)', 30.00, 999, true),
('Extra Days', 'Per Day', 'Additional rental days beyond standard period', 30.00, 999, true);
