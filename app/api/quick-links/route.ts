import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock quick links data matching Strapi format
    const quickLinksData = {
      data: [
        {
          id: 1,
          Title: "Attractions",
          Icon: "MapPin",
          Href: "/attractions",
          Color: "bg-blue-500",
          HoverColor: "hover:bg-blue-600",
          Count: 150,
          Category: "Tourism",
          Description: "Discover amazing places in Pattaya"
        },
        {
          id: 2,
          Title: "Events",
          Icon: "Calendar",
          Href: "/events",
          Color: "bg-purple-500",
          HoverColor: "hover:bg-purple-600",
          Count: 45,
          Category: "Entertainment",
          Description: "Upcoming events and festivals"
        },
        {
          id: 3,
          Title: "Restaurants",
          Icon: "Utensils",
          Href: "/restaurants",
          Color: "bg-orange-500",
          HoverColor: "hover:bg-orange-600",
          Count: 320,
          Category: "Food",
          Description: "Best dining experiences"
        },
        {
          id: 4,
          Title: "Nightlife",
          Icon: "Music",
          Href: "/nightlife",
          Color: "bg-pink-500",
          HoverColor: "hover:bg-pink-600",
          Count: 85,
          Category: "Entertainment",
          Description: "Vibrant nightlife scene"
        },
        {
          id: 5,
          Title: "Shopping",
          Icon: "ShoppingBag",
          Href: "/shopping",
          Color: "bg-green-500",
          HoverColor: "hover:bg-green-600",
          Count: 120,
          Category: "Shopping",
          Description: "Shopping centers and markets"
        },
        {
          id: 6,
          Title: "Beaches",
          Icon: "Waves",
          Href: "/beaches",
          Color: "bg-cyan-500",
          HoverColor: "hover:bg-cyan-600",
          Count: 25,
          Category: "Tourism",
          Description: "Beautiful beaches and water activities"
        },
        {
          id: 7,
          Title: "Hotels",
          Icon: "Hotel",
          Href: "/hotels",
          Color: "bg-indigo-500",
          HoverColor: "hover:bg-indigo-600",
          Count: 200,
          Category: "Accommodation",
          Description: "Find the perfect place to stay"
        },
        {
          id: 8,
          Title: "Transport",
          Icon: "Car",
          Href: "/transport",
          Color: "bg-gray-500",
          HoverColor: "hover:bg-gray-600",
          Count: 50,
          Category: "Services",
          Description: "Transportation options"
        }
      ],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 8
        }
      }
    }

    return NextResponse.json(quickLinksData)
  } catch (error) {
    console.error('Error in quick-links API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quick links' },
      { status: 500 }
    )
  }
}
