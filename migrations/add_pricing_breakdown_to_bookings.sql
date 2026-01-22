-- Migration: Add pricing_breakdown JSONB column to bookings table
-- This stores the complete pricing breakdown for all bookings (online and phone)
-- allowing admins to always see how the total was calculated

-- Add pricing_breakdown column (stores full breakdown as JSON)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS pricing_breakdown JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN bookings.pricing_breakdown IS 'JSON object storing complete pricing breakdown: {basePrice, includedDays, totalDays, extraDays, extraDaysAmount, extraTonnage, extraTonnageAmount, applianceCount, applianceAmount, distanceMiles, distanceFee, travelFee, priceAdjustment, adjustmentReason, subtotal, total}';

-- Example pricing_breakdown structure:
-- {
--   "containerType": "20 Yard",
--   "basePrice": 350,
--   "includedDays": 3,
--   "totalDays": 5,
--   "extraDays": 2,
--   "extraDaysAmount": 50,
--   "extraTonnage": 0,
--   "extraTonnageAmount": 0,
--   "applianceCount": 2,
--   "applianceAmount": 50,
--   "distanceMiles": 25,
--   "distanceFee": 7.50,
--   "travelFee": 0,
--   "priceAdjustment": -20,
--   "adjustmentReason": "Loyal customer discount",
--   "total": 437.50
-- }

-- Create index for JSONB queries if needed
CREATE INDEX IF NOT EXISTS idx_bookings_pricing_breakdown ON bookings USING GIN (pricing_breakdown);
