import { NextResponse } from 'next/server'

// Mock live flight data - replace with actual flight tracking API
const generateLiveFlightData = () => {
  const airlines = [
    { code: 'TG', name: 'Thai Airways' },
    { code: 'PG', name: 'Bangkok Airways' },
    { code: 'FD', name: 'AirAsia' },
    { code: 'DD', name: 'Nok Air' },
    { code: 'SL', name: 'Thai Lion Air' }
  ]

  const routes = [
    { origin: 'Bangkok (BKK)', destination: 'Phuket (HKT)', code: 'BKK-HKT' },
    { origin: 'Bangkok (BKK)', destination: 'Chiang Mai (CNX)', code: 'BKK-CNX' },
    { origin: 'Phuket (HKT)', destination: 'Bangkok (BKK)', code: 'HKT-BKK' },
    { origin: 'Chiang Mai (CNX)', destination: 'Bangkok (BKK)', code: 'CNX-BKK' },
    { origin: 'Bangkok (BKK)', destination: 'Pattaya (UTP)', code: 'BKK-UTP' },
    { origin: 'Pattaya (UTP)', destination: 'Bangkok (BKK)', code: 'UTP-BKK' }
  ]

  const statuses = ['On Time', 'Delayed', 'Boarding', 'In Air', 'Landed', 'Departed']
  const aircraftTypes = ['Boeing 737-800', 'Airbus A320', 'Boeing 777-300', 'Airbus A330']

  const flights = []
  const now = new Date()

  for (let i = 0; i < 12; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const route = routes[Math.floor(Math.random() * routes.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const delay = status === 'Delayed' ? Math.floor(Math.random() * 120) + 15 : 0
    
    // Generate realistic departure times (current time +/- 4 hours)
    const depTime = new Date(now.getTime() + (Math.random() - 0.5) * 8 * 60 * 60 * 1000)
    const arrTime = new Date(depTime.getTime() + (1.5 + Math.random() * 2) * 60 * 60 * 1000)
    
    const flight = {
      flightNumber: `${airline.code}${(100 + i).toString()}`,
      airline: airline.name,
      origin: route.origin,
      destination: route.destination,
      departureTime: depTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      arrivalTime: arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      actualDepartureTime: delay > 0 ? new Date(depTime.getTime() + delay * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
      actualArrivalTime: delay > 0 ? new Date(arrTime.getTime() + delay * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
      status,
      delay: delay > 0 ? delay : null,
      gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}${Math.floor(Math.random() * 20) + 1}`,
      terminal: (Math.floor(Math.random() * 3) + 1).toString(),
      aircraft: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
      altitude: status === 'In Air' ? Math.floor(Math.random() * 10000) + 30000 : null,
      speed: status === 'In Air' ? Math.floor(Math.random() * 100) + 450 : null,
      lastUpdated: now.toLocaleTimeString()
    }

    flights.push(flight)
  }

  return flights.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))
    
    const flights = generateLiveFlightData()
    
    return NextResponse.json({
      success: true,
      data: flights,
      meta: {
        count: flights.length,
        lastUpdated: new Date().toISOString(),
        source: 'Live Flight Tracking API'
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch live flight data',
      data: []
    }, { status: 500 })
  }
}
