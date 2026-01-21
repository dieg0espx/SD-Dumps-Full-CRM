// Distance calculation utility using Google Distance Matrix API
// Base location: 92082 (Valley Center, CA)

const BASE_ZIP_CODE = "92082"
const FREE_DISTANCE_MILES = 20
const PRICE_PER_MILE = 1.5

export interface DistanceResult {
  distanceMiles: number
  extraMiles: number
  distanceFee: number
  isWithinFreeRange: boolean
  error?: string
}

export async function calculateDistanceFee(destinationZipCode: string): Promise<DistanceResult> {
  // Default result for errors
  const defaultResult: DistanceResult = {
    distanceMiles: 0,
    extraMiles: 0,
    distanceFee: 0,
    isWithinFreeRange: true,
  }

  if (!destinationZipCode || destinationZipCode.length < 5) {
    return { ...defaultResult, error: "Invalid zip code" }
  }

  try {
    const response = await fetch('/api/calculate-distance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originZip: BASE_ZIP_CODE,
        destinationZip: destinationZipCode,
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      return { ...defaultResult, error: data.error || "Failed to calculate distance" }
    }

    const data = await response.json()

    const distanceMiles = data.distanceMiles
    const extraMiles = Math.max(0, distanceMiles - FREE_DISTANCE_MILES)
    const distanceFee = extraMiles * PRICE_PER_MILE

    return {
      distanceMiles: Math.round(distanceMiles * 10) / 10, // Round to 1 decimal
      extraMiles: Math.round(extraMiles * 10) / 10,
      distanceFee: Math.round(distanceFee * 100) / 100, // Round to cents
      isWithinFreeRange: distanceMiles <= FREE_DISTANCE_MILES,
    }
  } catch (error) {
    console.error("Error calculating distance:", error)
    return { ...defaultResult, error: "Failed to calculate distance" }
  }
}

// Constants exported for use in components
export const DISTANCE_CONSTANTS = {
  BASE_ZIP_CODE,
  FREE_DISTANCE_MILES,
  PRICE_PER_MILE,
}
