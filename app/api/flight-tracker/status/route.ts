import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock service status based on your working backend
    const status = {
      service: "Flight Tracker API",
      status: "operational",
      api_limit_reached: true, // Simulating the AviationStack limit
      data_source: "cached",
      last_updated: new Date().toISOString(),
      endpoints: {
        cached: "operational",
        live: "limited", 
        search: "operational",
        airports: "operational"
      },
      stats: {
        total_requests: 1250,
        cached_responses: 890,
        live_responses: 360,
        error_rate: "2.1%"
      },
      message: "AviationStack API monthly limit exceeded. Using cached data."
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error fetching service status:', error)
    return NextResponse.json(
      { 
        service: "Flight Tracker API",
        status: "error",
        message: "Failed to fetch service status"
      },
      { status: 500 }
    )
  }
}
