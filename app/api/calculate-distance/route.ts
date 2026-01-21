import { NextResponse } from "next/server"

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function POST(request: Request) {
  try {
    const { originZip, destinationZip } = await request.json()

    if (!originZip || !destinationZip) {
      return NextResponse.json(
        { error: "Origin and destination zip codes are required" },
        { status: 400 }
      )
    }

    if (!GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key not configured")
      return NextResponse.json(
        { error: "Distance calculation service not configured" },
        { status: 500 }
      )
    }

    // Use Google Distance Matrix API
    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json")
    url.searchParams.append("origins", `${originZip}, USA`)
    url.searchParams.append("destinations", `${destinationZip}, USA`)
    url.searchParams.append("units", "imperial")
    url.searchParams.append("key", GOOGLE_MAPS_API_KEY)

    const response = await fetch(url.toString())
    const data = await response.json()

    if (data.status !== "OK") {
      console.error("Google Maps API error:", data)
      return NextResponse.json(
        { error: "Failed to calculate distance" },
        { status: 500 }
      )
    }

    const element = data.rows?.[0]?.elements?.[0]

    if (!element || element.status !== "OK") {
      console.error("Distance calculation failed:", element)
      return NextResponse.json(
        { error: "Could not calculate distance for this location" },
        { status: 400 }
      )
    }

    // Distance is returned in meters, convert to miles
    const distanceMeters = element.distance.value
    const distanceMiles = distanceMeters / 1609.34

    return NextResponse.json({
      distanceMiles: Math.round(distanceMiles * 10) / 10,
      distanceText: element.distance.text,
      durationText: element.duration.text,
      originAddress: data.origin_addresses?.[0],
      destinationAddress: data.destination_addresses?.[0],
    })
  } catch (error) {
    console.error("Error calculating distance:", error)
    return NextResponse.json(
      { error: "Failed to calculate distance" },
      { status: 500 }
    )
  }
}
