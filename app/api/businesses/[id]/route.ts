import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const businessId = params.id

  // Simulate business data lookup
  const businesses = {
    "1": {
      id: "1",
      name: "Ocean View Restaurant",
      description:
        "Authentic Thai cuisine with stunning ocean views and fresh seafood daily. Experience the best of Thai hospitality in our beachfront location.",
      longDescription:
        "Ocean View Restaurant has been serving authentic Thai cuisine for over 15 years. Located directly on Pattaya Beach, we offer an unparalleled dining experience with panoramic ocean views. Our menu features traditional Thai dishes prepared with the freshest local ingredients, including daily catches from local fishermen. Whether you're looking for a romantic dinner or a family meal, our restaurant provides the perfect ambiance with both indoor air-conditioned seating and outdoor terrace dining.",
      address: "123 Beach Road, Pattaya, Chonburi 20150",
      phone: "+66 38 123 4567",
      email: "info@oceanview-pattaya.com",
      website: "https://oceanview-pattaya.com",
      rating: 4.8,
      reviewCount: 245,
      category: "Thai Restaurant",
      images: [
        "/placeholder.svg?height=400&width=800",
        "/placeholder.svg?height=400&width=800",
        "/placeholder.svg?height=400&width=800",
      ],
      isOpen: true,
      verified: true,
      amenities: [
        "Ocean View",
        "Air Conditioning",
        "Free WiFi",
        "Parking Available",
        "Credit Cards Accepted",
        "Outdoor Seating",
        "Live Music",
        "Private Dining",
        "Wheelchair Accessible",
        "Delivery Available",
      ],
      hours: {
        monday: "11:00 AM - 11:00 PM",
        tuesday: "11:00 AM - 11:00 PM",
        wednesday: "11:00 AM - 11:00 PM",
        thursday: "11:00 AM - 11:00 PM",
        friday: "11:00 AM - 12:00 AM",
        saturday: "11:00 AM - 12:00 AM",
        sunday: "11:00 AM - 11:00 PM",
      },
      location: {
        lat: 12.9236,
        lng: 100.8825,
      },
    },
  }

  const business = businesses[businessId as keyof typeof businesses]

  if (!business) {
    return NextResponse.json({ message: "Business not found" }, { status: 404 })
  }

  return NextResponse.json({ data: business })
}
