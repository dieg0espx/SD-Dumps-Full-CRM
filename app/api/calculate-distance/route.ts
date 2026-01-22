import { NextResponse } from "next/server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function POST(request: Request) {
  console.log("=== DISTANCE CALCULATION START ===")

  try {
    const { originZip, destinationZip } = await request.json()
    console.log("Request received - Origin:", originZip, "Destination:", destinationZip)

    if (!originZip || !destinationZip) {
      console.log("ERROR: Missing zip codes")
      return NextResponse.json(
        { error: "Origin and destination zip codes are required" },
        { status: 400 }
      )
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.log("ERROR: GOOGLE_MAPS_API_KEY is not set")
      console.log("Environment check - API key exists:", !!GOOGLE_MAPS_API_KEY)
      return NextResponse.json(
        { error: "Distance calculation service not configured" },
        { status: 500 }
      )
    }

    console.log("API Key exists:", !!GOOGLE_MAPS_API_KEY, "Length:", GOOGLE_MAPS_API_KEY.length)

    // Use Google Distance Matrix API
    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json")
    url.searchParams.append("origins", `${originZip}, USA`)
    url.searchParams.append("destinations", `${destinationZip}, USA`)
    url.searchParams.append("units", "imperial")
    url.searchParams.append("key", GOOGLE_MAPS_API_KEY)

    console.log("Fetching from Google Maps API...")
    const response = await fetch(url.toString())
    const data = await response.json()
    console.log("Google Maps API Response:", JSON.stringify(data, null, 2))

    if (data.status !== "OK") {
      console.log("ERROR: Google Maps API returned status:", data.status)
      console.log("Error message:", data.error_message)
      return NextResponse.json(
        { error: "Failed to calculate distance" },
        { status: 500 }
      )
    }

    const element = data.rows?.[0]?.elements?.[0]
    console.log("Distance element:", JSON.stringify(element, null, 2))

    if (!element || element.status !== "OK") {
      console.log("ERROR: Element status not OK:", element?.status)
      return NextResponse.json(
        { error: "Could not calculate distance for this location" },
        { status: 400 }
      )
    }

    // Distance is returned in meters, convert to miles
    const distanceMeters = element.distance.value
    const distanceMiles = distanceMeters / 1609.34
    console.log("Distance calculated:", distanceMiles, "miles")

    const result = {
      distanceMiles: Math.round(distanceMiles * 10) / 10,
      distanceText: element.distance.text,
      durationText: element.duration.text,
      originAddress: data.origin_addresses?.[0],
      destinationAddress: data.destination_addresses?.[0],
    }

    console.log("SUCCESS - Returning:", JSON.stringify(result, null, 2))
    console.log("=== DISTANCE CALCULATION END ===")

    return NextResponse.json(result)
  } catch (error) {
    console.log("=== DISTANCE CALCULATION ERROR ===")
    console.error("Caught error:", error)
    return NextResponse.json(
      { error: "Failed to calculate distance" },
      { status: 500 }
    )
  }
}
