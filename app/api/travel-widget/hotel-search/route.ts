import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('destination') || searchParams.get('location') || 'Pattaya'
    const checkin = searchParams.get('checkinDate') || searchParams.get('checkin')
    const checkout = searchParams.get('checkoutDate') || searchParams.get('checkout')
    const guests = searchParams.get('adults') || searchParams.get('guests') || '2'
    const rooms = searchParams.get('rooms') || '1'

    // Mock hotel search data for Pattaya
    const hotelResults = {
      data: [
        {
          id: 1,
          name: "Hilton Pattaya",
          rating: 4.5,
          price: 3200,
          currency: "THB",
          location: "Central Pattaya",
          image: "/placeholder-hotel.jpg",
          amenities: ["Pool", "WiFi", "Spa", "Gym", "Restaurant"],
          description: "Luxury beachfront hotel with stunning ocean views",
          availability: true,
          coordinates: { lat: 12.9236, lng: 100.8825 }
        },
        {
          id: 2,
          name: "Centara Grand Mirage Beach Resort",
          rating: 4.3,
          price: 2800,
          currency: "THB",
          location: "Wong Amat Beach",
          image: "/placeholder-hotel.jpg",
          amenities: ["Pool", "WiFi", "Beach Access", "Kids Club", "Restaurant"],
          description: "Family-friendly resort with water park and beach access",
          availability: true,
          coordinates: { lat: 12.9456, lng: 100.8756 }
        },
        {
          id: 3,
          name: "Royal Cliff Hotels Group",
          rating: 4.2,
          price: 2500,
          currency: "THB",
          location: "South Pattaya",
          image: "/placeholder-hotel.jpg",
          amenities: ["Pool", "WiFi", "Spa", "Multiple Restaurants", "Tennis"],
          description: "Iconic cliff-top resort with panoramic sea views",
          availability: true,
          coordinates: { lat: 12.9156, lng: 100.8845 }
        },
        {
          id: 4,
          name: "Dusit Thani Pattaya",
          rating: 4.4,
          price: 3500,
          currency: "THB",
          location: "North Pattaya",
          image: "/placeholder-hotel.jpg",
          amenities: ["Pool", "WiFi", "Spa", "Beach Access", "Fine Dining"],
          description: "Premium beachfront hotel with Thai hospitality",
          availability: true,
          coordinates: { lat: 12.9356, lng: 100.8785 }
        },
        {
          id: 5,
          name: "Amari Pattaya",
          rating: 4.1,
          price: 2200,
          currency: "THB",
          location: "Beach Road",
          image: "/placeholder-hotel.jpg",
          amenities: ["Pool", "WiFi", "Rooftop Bar", "Gym", "Restaurant"],
          description: "Modern hotel in the heart of Pattaya's entertainment district",
          availability: true,
          coordinates: { lat: 12.9276, lng: 100.8815 }
        },
        {
          id: 6,
          name: "InterContinental Pattaya Resort",
          rating: 4.6,
          price: 4200,
          currency: "THB",
          location: "Jomtien Beach",
          image: "/placeholder-hotel.jpg",
          amenities: ["Pool", "WiFi", "Spa", "Private Beach", "Multiple Restaurants"],
          description: "Luxury resort with private beach and world-class amenities",
          availability: true,
          coordinates: { lat: 12.8956, lng: 100.8925 }
        }
      ],
      meta: {
        location,
        checkin,
        checkout,
        guests: parseInt(guests),
        rooms: parseInt(rooms),
        total: 6,
        currency: "THB",
        searchId: `search_${Date.now()}`,
        timestamp: new Date().toISOString()
      },
      filters: {
        priceRange: { min: 1500, max: 5000 },
        ratings: [3, 3.5, 4, 4.5, 5],
        amenities: ["Pool", "WiFi", "Spa", "Gym", "Restaurant", "Beach Access", "Kids Club"],
        locations: ["Central Pattaya", "North Pattaya", "South Pattaya", "Jomtien Beach", "Wong Amat Beach"]
      }
    }

    return NextResponse.json(hotelResults)
  } catch (error) {
    console.error('Error in hotel search API:', error)
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { location, checkin, checkout, guests, rooms, filters } = body

    // Handle POST request with filters
    const filteredResults = {
      data: [
        {
          id: 1,
          name: "Hilton Pattaya",
          rating: 4.5,
          price: 3200,
          currency: "THB",
          location: "Central Pattaya",
          image: "/placeholder-hotel.jpg",
          amenities: ["Pool", "WiFi", "Spa", "Gym", "Restaurant"],
          description: "Luxury beachfront hotel with stunning ocean views",
          availability: true,
          coordinates: { lat: 12.9236, lng: 100.8825 }
        }
      ],
      meta: {
        location: location || 'Pattaya',
        checkin,
        checkout,
        guests: guests || 2,
        rooms: rooms || 1,
        total: 1,
        currency: "THB",
        searchId: `search_${Date.now()}`,
        timestamp: new Date().toISOString(),
        appliedFilters: filters
      }
    }

    return NextResponse.json(filteredResults)
  } catch (error) {
    console.error('Error in hotel search POST API:', error)
    return NextResponse.json(
      { error: 'Failed to process hotel search' },
      { status: 500 }
    )
  }
}
