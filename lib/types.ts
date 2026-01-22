// Shared TypeScript types for the application

/**
 * Pricing breakdown structure for bookings
 * Stores complete pricing details for all bookings (online and phone)
 * to allow admins to always see how the total was calculated
 */
export interface PricingBreakdown {
  /** Container type/size (e.g., "20 Yard") */
  containerType: string
  /** Base price for the container (includes first 3 days) */
  basePrice: number
  /** Number of days included in base price (typically 3) */
  includedDays: number
  /** Total number of rental days */
  totalDays: number
  /** Number of days beyond included days */
  extraDays: number
  /** Charge for extra days (extraDays * $25) */
  extraDaysAmount: number
  /** Number of extra tons beyond included tonnage */
  extraTonnage: number
  /** Charge for extra tonnage (extraTonnage * $125) */
  extraTonnageAmount: number
  /** Number of appliances for disposal */
  applianceCount: number
  /** Charge for appliances (applianceCount * $25) */
  applianceAmount: number
  /** Distance in miles from base location (92082) */
  distanceMiles: number | null
  /** Distance fee for delivery (calculated from miles) */
  distanceFee: number
  /** Manual travel fee added by admin */
  travelFee: number
  /** Price adjustment (negative for discounts, positive for charges) */
  priceAdjustment: number
  /** Reason for price adjustment */
  adjustmentReason: string | null
  /** Final total amount */
  total: number
}
