import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { airport: string } }
) {
  try {
    const airport = params.airport
    
    // Mock response for live flights endpoint
    // Since AviationStack API limit is reached, return empty data with proper structure
    const response = {
      data: [],
      meta: {
        airport: airport,
        total: 0,
        source: "aviationstack_api",
        message: "API limit exceeded. No live data available.",
        fallback_available: true
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching live flights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch live flight data' },
      { status: 500 }
    )
  }
}
