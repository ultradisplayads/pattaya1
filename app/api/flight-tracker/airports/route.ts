import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Mock airports data
    const airports = [
      {
        iata: "BKK",
        name: "Suvarnabhumi Airport",
        city: "Bangkok",
        country: "Thailand",
        timezone: "Asia/Bangkok",
        active: true
      },
      {
        iata: "HKT", 
        name: "Phuket International Airport",
        city: "Phuket",
        country: "Thailand",
        timezone: "Asia/Bangkok",
        active: true
      },
      {
        iata: "CNX",
        name: "Chiang Mai International Airport", 
        city: "Chiang Mai",
        country: "Thailand",
        timezone: "Asia/Bangkok",
        active: true
      },
      {
        iata: "UTP",
        name: "U-Tapao International Airport",
        city: "Pattaya",
        country: "Thailand", 
        timezone: "Asia/Bangkok",
        active: true
      },
      {
        iata: "KBV",
        name: "Krabi Airport",
        city: "Krabi", 
        country: "Thailand",
        timezone: "Asia/Bangkok",
        active: true
      }
    ]

    return NextResponse.json({
      data: airports,
      meta: {
        total: airports.length,
        source: "static_data"
      }
    })
  } catch (error) {
    console.error('Error fetching airports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch airports data' },
      { status: 500 }
    )
  }
}
