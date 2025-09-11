import { NextRequest, NextResponse } from 'next/server'

// Mock cached flight data based on your sample structure
const cachedFlights = [
  {
    FlightNumber: "TG101",
    Airline: "Thai Airways International",
    Aircraft: "Boeing 777-300",
    FlightStatus: "active",
    Airport: "BKK",
    OriginAirport: "London Heathrow",
    DestinationAirport: "Bangkok",
    ScheduledTime: "2025-01-11T14:30:00.000Z",
    EstimatedTime: "2025-01-11T14:45:00.000Z",
    Terminal: "1",
    Gate: "A7",
    BaggageClaim: "B12",
    DelayMinutes: 15
  },
  {
    FlightNumber: "PG205",
    Airline: "Bangkok Airways",
    Aircraft: "Airbus A320",
    FlightStatus: "scheduled",
    Airport: "BKK",
    OriginAirport: "Phuket",
    DestinationAirport: "Bangkok",
    ScheduledTime: "2025-01-11T16:20:00.000Z",
    Terminal: "1",
    Gate: "B3",
    BaggageClaim: "B8"
  },
  {
    FlightNumber: "FD3142",
    Airline: "AirAsia",
    Aircraft: "Airbus A320",
    FlightStatus: "boarding",
    Airport: "BKK",
    OriginAirport: "Chiang Mai",
    DestinationAirport: "Bangkok",
    ScheduledTime: "2025-01-11T18:15:00.000Z",
    Terminal: "1",
    Gate: "C5",
    BaggageClaim: "C2"
  },
  {
    FlightNumber: "DD7104",
    Airline: "Nok Air",
    Aircraft: "Boeing 737-800",
    FlightStatus: "delayed",
    Airport: "BKK",
    OriginAirport: "Hat Yai",
    DestinationAirport: "Bangkok",
    ScheduledTime: "2025-01-11T19:45:00.000Z",
    EstimatedTime: "2025-01-11T20:30:00.000Z",
    Terminal: "1",
    Gate: "D2",
    BaggageClaim: "D5",
    DelayMinutes: 45
  },
  {
    FlightNumber: "SL501",
    Airline: "Thai Lion Air",
    Aircraft: "Boeing 737-900ER",
    FlightStatus: "landed",
    Airport: "BKK",
    OriginAirport: "Krabi",
    DestinationAirport: "Bangkok",
    ScheduledTime: "2025-01-11T20:10:00.000Z",
    EstimatedTime: "2025-01-11T20:05:00.000Z",
    Terminal: "1",
    Gate: "E1",
    BaggageClaim: "E3",
    DelayMinutes: -5
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const airport = searchParams.get('airport') || 'BKK'
    const type = searchParams.get('type') // arrivals, departures
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')

    let filteredFlights = cachedFlights.filter(flight => 
      flight.Airport === airport
    )

    // Filter by status if provided
    if (status && status !== 'all') {
      filteredFlights = filteredFlights.filter(flight => 
        flight.FlightStatus === status
      )
    }

    // Apply limit
    filteredFlights = filteredFlights.slice(0, limit)

    return NextResponse.json({
      data: filteredFlights,
      meta: {
        airport,
        total: filteredFlights.length,
        source: "database",
        cached: true
      }
    })
  } catch (error) {
    console.error('Error fetching cached flights:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cached flight data' },
      { status: 500 }
    )
  }
}
