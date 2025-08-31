import { NextRequest, NextResponse } from "next/server"
import { buildApiUrl } from "@/lib/strapi-config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { temperature, humidity, description, location } = body

    // Validate required fields
    if (!temperature || !description || !location) {
      return NextResponse.json(
        { error: "Missing required fields: temperature, description, location" },
        { status: 400 }
      )
    }

    // Create weather data object
    const weatherData = {
      data: {
        Temperature: temperature,
        Humidity: humidity || null,
        Description: description,
        Location: location,
        IsActive: true,
        LastUpdated: new Date().toISOString(),
      },
    }

    // Update weather in Strapi
    const strapiResponse = await fetch(buildApiUrl('weathers'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(weatherData),
    })

    if (!strapiResponse.ok) {
      const errorData = await strapiResponse.json()
      console.error("Strapi API error:", errorData)
      return NextResponse.json(
        { error: "Failed to update weather data in Strapi" },
        { status: 500 }
      )
    }

    const result = await strapiResponse.json()

    return NextResponse.json({
      success: true,
      message: "Weather data updated successfully",
      data: result,
    })
  } catch (error) {
    console.error("Weather update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 