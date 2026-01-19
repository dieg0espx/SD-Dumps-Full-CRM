-- Migration: Add pricing fields to bookings table
-- This adds travel_fee, price_adjustment, and adjustment_reason columns
-- to properly store phone booking pricing adjustments

-- Add travel_fee column (stores the delivery travel fee amount)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS travel_fee DECIMAL(10,2) DEFAULT NULL;

-- Add price_adjustment column (positive for charges, negative for discounts)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS price_adjustment DECIMAL(10,2) DEFAULT NULL;

-- Add adjustment_reason column (description for the price adjustment)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS adjustment_reason TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN bookings.travel_fee IS 'Additional fee for delivery distance';
COMMENT ON COLUMN bookings.price_adjustment IS 'Price adjustment amount - negative for discounts, positive for extra charges';
COMMENT ON COLUMN bookings.adjustment_reason IS 'Reason/description for the price adjustment (e.g., loyal customer, rush fee)';
